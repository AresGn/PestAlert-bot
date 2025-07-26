import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://pestalert-kb99kjhkv-ares-projects-0b0ee8dc.vercel.app';

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
  };
  token: string;
  expiresIn: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class AuthService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api/auth`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token aux requêtes
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Intercepteur pour gérer les erreurs d'authentification
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Définir le token d'authentification
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Supprimer le token d'authentification
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Connexion
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post<ApiResponse<LoginResponse>>('/login', {
        email,
        password,
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Erreur de connexion');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erreur de connexion au serveur');
    }
  }

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    try {
      await this.api.post('/logout');
    } catch (error) {
      // Ignorer les erreurs de déconnexion côté serveur
      console.warn('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      this.clearToken();
    }
  }

  /**
   * Obtenir le profil utilisateur
   */
  async getProfile() {
    try {
      const response = await this.api.get<ApiResponse<LoginResponse['user']>>('/me');

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Erreur lors de la récupération du profil');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erreur lors de la récupération du profil');
    }
  }

  /**
   * Mettre à jour le profil
   */
  async updateProfile(data: { name?: string; email?: string }) {
    try {
      const response = await this.api.put<ApiResponse<LoginResponse['user']>>('/profile', data);

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Erreur lors de la mise à jour');
      }

      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erreur lors de la mise à jour du profil');
    }
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await this.api.put<ApiResponse<void>>('/password', {
        currentPassword,
        newPassword,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erreur lors du changement de mot de passe');
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();
