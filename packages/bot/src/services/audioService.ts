import { MessageMedia } from 'whatsapp-web.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Service pour gérer l'envoi de notes vocales
 */
export class AudioService {
  private audioPath: string;

  constructor() {
    this.audioPath = path.join(__dirname, '../../audio');
  }

  /**
   * Créer un MessageMedia à partir d'un fichier audio
   */
  async createAudioMessage(filename: string): Promise<MessageMedia | null> {
    try {
      const filePath = path.join(this.audioPath, filename);
      
      // Vérifier que le fichier existe
      if (!fs.existsSync(filePath)) {
        console.error(`❌ Fichier audio non trouvé: ${filePath}`);
        return null;
      }

      // Lire le fichier audio
      const audioBuffer = fs.readFileSync(filePath);
      const base64Audio = audioBuffer.toString('base64');

      // Créer le MessageMedia
      const audioMessage = new MessageMedia('audio/mpeg', base64Audio, filename);
      
      console.log(`✅ Note vocale préparée: ${filename}`);
      return audioMessage;

    } catch (error: any) {
      console.error(`❌ Erreur lors de la création de la note vocale:`, error.message);
      return null;
    }
  }

  /**
   * Obtenir la note vocale pour une réponse normale
   */
  async getNormalResponseAudio(): Promise<MessageMedia | null> {
    return await this.createAudioMessage('Reponse.mp3');
  }

  /**
   * Obtenir la note vocale pour une alerte
   */
  async getAlertAudio(): Promise<MessageMedia | null> {
    return await this.createAudioMessage('Alerte.mp3');
  }

  /**
   * Obtenir la note vocale pour une réponse incertaine
   */
  async getUncertainAudio(): Promise<MessageMedia | null> {
    return await this.createAudioMessage('Incertaine.mp3');
  }

  /**
   * Vérifier que tous les fichiers audio nécessaires existent
   */
  checkAudioFiles(): { available: boolean; missing: string[] } {
    const requiredFiles = ['Reponse.mp3', 'Alerte.mp3', 'Incertaine.mp3'];
    const missing: string[] = [];

    requiredFiles.forEach(filename => {
      const filePath = path.join(this.audioPath, filename);
      if (!fs.existsSync(filePath)) {
        missing.push(filename);
      }
    });

    return {
      available: missing.length === 0,
      missing
    };
  }

  /**
   * Obtenir les informations sur un fichier audio
   */
  getAudioInfo(filename: string): { exists: boolean; size?: number; path?: string } {
    try {
      const filePath = path.join(this.audioPath, filename);
      
      if (!fs.existsSync(filePath)) {
        return { exists: false };
      }

      const stats = fs.statSync(filePath);
      return {
        exists: true,
        size: stats.size,
        path: filePath
      };

    } catch (error) {
      return { exists: false };
    }
  }
}
