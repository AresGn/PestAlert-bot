import { CropHealthService } from './cropHealthService';
import { AudioService } from './audioService';
import { ImageProcessingService } from './imageProcessingService';
import { LoggingService } from './loggingService';
import { MessageMedia } from 'whatsapp-web.js';

export interface HealthAnalysisResult {
  isHealthy: boolean;
  confidence: number;
  audioMessage: MessageMedia | null;
  textMessage: string;
  recommendation?: string;
}

/**
 * Service spécialisé pour l'analyse de santé des cultures (Option 1)
 */
export class HealthAnalysisService {
  private cropHealthService: CropHealthService;
  private audioService: AudioService;
  private imageProcessingService: ImageProcessingService;
  private logger: LoggingService;

  constructor() {
    this.cropHealthService = new CropHealthService();
    this.audioService = new AudioService();
    this.imageProcessingService = new ImageProcessingService();
    this.logger = new LoggingService();
  }

  /**
   * Analyser la santé d'une culture à partir d'une image
   */
  async analyzeCropHealth(imageBuffer: Buffer, userId: string): Promise<HealthAnalysisResult> {
    try {
      console.log(`🌾 Début de l'analyse de santé pour ${userId}`);
      
      // 1. Prétraitement de l'image
      const imageOptimization = await this.imageProcessingService.optimizeForAnalysis(imageBuffer);
      
      if (!imageOptimization.success) {
        return {
          isHealthy: false,
          confidence: 0,
          audioMessage: null,
          textMessage: `❌ Problème avec l'image: ${imageOptimization.error}\n\n📷 Veuillez envoyer une nouvelle photo plus claire.`,
          recommendation: "Améliorer la qualité de l'image"
        };
      }

      // 2. Analyse binaire avec OpenEPI
      const binaryResult = await this.cropHealthService.analyzeBinaryHealth(
        imageOptimization.processedImage!
      );

      console.log(`📊 Résultat binaire: ${binaryResult.prediction} (${(binaryResult.confidence * 100).toFixed(1)}%)`);

      // 3. Déterminer le résultat et l'audio approprié
      const isHealthy = binaryResult.prediction === 'healthy';
      const confidence = binaryResult.confidence;

      // 4. Obtenir l'audio approprié
      let audioMessage: MessageMedia | null = null;
      if (isHealthy) {
        audioMessage = await this.audioService.getHealthyCropAudio();
      } else {
        audioMessage = await this.audioService.getDiseasedCropAudio();
      }

      // 5. Générer le message texte
      const textMessage = this.generateHealthMessage(isHealthy, confidence);

      // 6. Logger l'analyse
      this.logger.logBotActivity(userId, 'Health Analysis', {
        prediction: binaryResult.prediction,
        confidence: confidence,
        timestamp: new Date().toISOString()
      });

      return {
        isHealthy,
        confidence,
        audioMessage,
        textMessage,
        recommendation: this.generateRecommendation(isHealthy, confidence)
      };

    } catch (error: any) {
      console.error('❌ Erreur lors de l\'analyse de santé:', error.message);
      
      this.logger.logServiceError('HEALTH_ANALYSIS', error.message, userId);
      
      return {
        isHealthy: false,
        confidence: 0,
        audioMessage: null,
        textMessage: "❌ Une erreur s'est produite lors de l'analyse. Veuillez réessayer avec une nouvelle photo.",
        recommendation: "Réessayer l'analyse"
      };
    }
  }

  /**
   * Générer le message texte selon le résultat
   */
  private generateHealthMessage(isHealthy: boolean, confidence: number): string {
    const confidencePercent = (confidence * 100).toFixed(1);
    
    if (isHealthy) {
      return `✅ **CULTURE SAINE**

🌾 **Résultat**: Votre culture semble être en bonne santé
📊 **Confiance**: ${confidencePercent}%
⏰ **Analysé**: ${new Date().toLocaleString()}

🎯 **Recommandations**:
• Continuez vos pratiques actuelles
• Surveillez régulièrement l'évolution
• Maintenez les conditions optimales

💡 Tapez 'menu' pour revenir au menu principal`;
    } else {
      return `⚠️ **ATTENTION REQUISE**

🌾 **Résultat**: Votre culture nécessite une attention
📊 **Confiance**: ${confidencePercent}%
⏰ **Analysé**: ${new Date().toLocaleString()}

🚨 **Actions recommandées**:
• Examinez la culture de plus près
• Consultez un expert agricole si nécessaire
• Surveillez l'évolution quotidiennement
• Envisagez un traitement préventif

💡 Tapez 'menu' pour revenir au menu principal`;
    }
  }

  /**
   * Générer des recommandations selon le résultat
   */
  private generateRecommendation(isHealthy: boolean, confidence: number): string {
    if (isHealthy) {
      if (confidence > 0.8) {
        return "Culture en excellente santé - continuez vos pratiques";
      } else {
        return "Culture saine mais surveillez l'évolution";
      }
    } else {
      if (confidence > 0.8) {
        return "Problème détecté avec forte confiance - action immédiate recommandée";
      } else {
        return "Problème potentiel détecté - surveillance renforcée recommandée";
      }
    }
  }

  /**
   * Vérifier le statut du service
   */
  async checkServiceStatus(): Promise<{ status: string; error?: string }> {
    try {
      const cropHealthStatus = await this.cropHealthService.checkStatus();
      const audioStatus = this.audioService.checkAudioFiles();
      
      if (cropHealthStatus.status !== 'healthy') {
        return {
          status: 'error',
          error: 'Service OpenEPI non disponible'
        };
      }
      
      if (!audioStatus.available) {
        return {
          status: 'warning',
          error: `Fichiers audio manquants: ${audioStatus.missing.join(', ')}`
        };
      }
      
      return { status: 'healthy' };
    } catch (error: any) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }
}
