import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌾</span>
              <h1 className="text-2xl font-bold text-green-600">PestAlert</h1>
            </div>
            <div className="space-x-4">
              <button className="text-gray-600 hover:text-green-600">Connexion</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                S'inscrire
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Système d'Alerte Précoce pour Ravageurs
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Protégez vos cultures avec l'intelligence artificielle et les données satellites. 
            Détection précoce des chenilles légionnaires et autres ravageurs au Togo.
          </p>
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
            Commencer maintenant
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">IA Avancée</h3>
            <p className="text-gray-600">
              Analyse automatique des images de cultures via WhatsApp
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">WhatsApp Bot</h3>
            <p className="text-gray-600">
              Interface simple et accessible pour tous les agriculteurs
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Alertes Rapides</h3>
            <p className="text-gray-600">
              Notifications instantanées et interventions terrain
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-green-600 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Prêt à protéger vos cultures ?</h3>
          <p className="text-green-100 mb-6">
            Rejoignez les agriculteurs qui utilisent déjà PestAlert pour sécuriser leurs récoltes.
          </p>
          <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Inscription gratuite
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 PestAlert. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
