import FormData from 'form-data';
import { cropHealthConfig } from '../config/openepi';
import { AuthService } from './authService';
import {
  BinaryAnalysisResult,
  MultiClassAnalysisResult,
  MultiClassPrediction,
  ImageMetadata
} from '../types';

/**
 * Service pour l'intégration avec l'API OpenEPI Crop Health
 */
export class CropHealthService {
  private authService: AuthService;
  private baseURL: string;

  constructor() {
    this.authService = new AuthService();
    this.baseURL = cropHealthConfig.baseURL;
  }

  /**
   * Vérifier le statut du service
   */
  async checkStatus(): Promise<{ status: string; timestamp: string; service?: string; data?: any; error?: string }> {
    try {
      // Vérifier si l'authentification est configurée
      if (!this.authService.isConfigured()) {
        return {
          status: 'unhealthy',
          error: 'Clés d\'authentification non configurées',
          timestamp: new Date().toISOString()
        };
      }

      // Tester l'authentification
      await this.authService.getAccessToken();

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'OpenEPI Crop Health',
        data: { authenticated: true }
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Analyse binaire (Sain/Malade) - Route correcte OpenEPI
   */
  async analyzeBinaryHealth(imageBuffer: Buffer, metadata: ImageMetadata = {}): Promise<BinaryAnalysisResult> {
    try {
      // Obtenir le token d'authentification
      const token = await this.authService.getAccessToken();

      // Préparer FormData pour l'upload
      const formData = new FormData();
      formData.append('image', imageBuffer, {
        filename: metadata.filename || `crop_${Date.now()}.jpg`,
        contentType: 'image/jpeg'
      });

      // Appel à la bonne route OpenEPI
      const response = await fetch(`${this.baseURL}/crop-health/predictionsWithBinary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: any = await response.json();

      return {
        prediction: data.health === 'healthy' ? 'healthy' : 'diseased',
        confidence: data.confidence || 0.8, // Valeur par défaut si non fournie
        timestamp: new Date().toISOString(),
        processing_time: data.processing_time
      };
    } catch (error: any) {
      throw new Error(`Binary prediction failed: ${error.message}`);
    }
  }

  /**
   * Analyse avec probabilités - Route correcte OpenEPI
   */
  async analyzeMultiClass(imageBuffer: Buffer, options: any = {}): Promise<MultiClassAnalysisResult> {
    try {
      // Obtenir le token d'authentification
      const token = await this.authService.getAccessToken();

      // Préparer FormData pour l'upload
      const formData = new FormData();
      formData.append('image', imageBuffer, {
        filename: `crop_analysis_${Date.now()}.jpg`,
        contentType: 'image/jpeg'
      });

      // Appel à la route avec probabilités
      const response = await fetch(`${this.baseURL}/crop-health/predictionsWithProbabilities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: any = await response.json();

      // Traitement des résultats - adapter selon la structure réelle de la réponse
      let sortedPredictions: MultiClassPrediction[] = [];

      if (data.probabilities && typeof data.probabilities === 'object') {
        sortedPredictions = Object.entries(data.probabilities)
          .map(([disease, confidence]) => ({
            disease,
            confidence: parseFloat(confidence as string),
            risk_level: this.calculateRiskLevel(parseFloat(confidence as string))
          }))
          .sort((a, b) => b.confidence - a.confidence);
      } else {
        // Fallback si la structure est différente
        sortedPredictions = [{
          disease: data.health || 'unknown',
          confidence: data.confidence || 0.5,
          risk_level: this.calculateRiskLevel(data.confidence || 0.5)
        }];
      }

      return {
        top_prediction: sortedPredictions[0],
        all_predictions: sortedPredictions,
        timestamp: new Date().toISOString(),
        analysis_type: 'probabilities'
      };
    } catch (error: any) {
      throw new Error(`Multi-class prediction failed: ${error.message}`);
    }
  }

  /**
   * Analyse spécialisée - Utilise la même route que analyzeMultiClass pour l'instant
   */
  async analyzeSpecialized(imageBuffer: Buffer, cropType: string): Promise<any> {
    try {
      const multiClassResult = await this.analyzeMultiClass(imageBuffer);

      return {
        crop_type: cropType,
        predictions: multiClassResult.all_predictions,
        recommendations: this.generateRecommendations(multiClassResult.all_predictions, cropType),
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      throw new Error(`Specialized prediction failed: ${error.message}`);
    }
  }

  /**
   * Calculer le niveau de risque basé sur la confiance
   */
  private calculateRiskLevel(confidence: number): 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (confidence >= 0.8) return 'CRITICAL';
    if (confidence >= 0.6) return 'HIGH';
    if (confidence >= 0.4) return 'MEDIUM';
    if (confidence >= 0.2) return 'LOW';
    return 'MINIMAL';
  }

  /**
   * Générer des recommandations basées sur l'analyse
   */
  private generateRecommendations(predictions: MultiClassPrediction[], cropType: string): string[] {
    const recommendations: string[] = [];

    if (predictions.length === 0) {
      recommendations.push('Continuer la surveillance régulière');
      recommendations.push('Maintenir les bonnes pratiques agricoles');
      return recommendations;
    }

    const topPrediction = predictions[0];

    if (topPrediction.confidence > 0.7) {
      recommendations.push(`Traitement immédiat recommandé pour ${topPrediction.disease}`);
      recommendations.push('Consulter un expert agricole');
      recommendations.push('Isoler les plants affectés');
    } else if (topPrediction.confidence > 0.4) {
      recommendations.push('Surveillance accrue recommandée');
      recommendations.push('Traitement préventif possible');
    } else {
      recommendations.push('Continuer la surveillance régulière');
      recommendations.push('Maintenir les bonnes pratiques agricoles');
    }

    return recommendations;
  }
}
