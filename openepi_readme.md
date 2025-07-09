# OpenEPI API - Guide Python Complet

## 🌍 Vue d'ensemble

OpenEPI (Open Earth Platform Initiative) est une plateforme numérique mondiale pour l'innovation climatique et agricole. Ce guide vous montre comment utiliser toutes les APIs OpenEPI avec Python.

## 📋 Prérequis

```bash
pip install requests pillow asyncio aiohttp
```

## 🚀 Installation et Configuration

```python
import requests
import json
import asyncio
import aiohttp
from PIL import Image
import io
import base64
from datetime import datetime, timedelta

# Configuration de base
BASE_URL = "https://api.openepi.io"
GBIF_URL = "https://api.gbif.org/v1"

# Clé API optionnelle (augmente les limites de taux)
API_KEY = "your_api_key_here"  # Optionnel

# Headers communs
HEADERS = {
    "User-Agent": "OpenEPI-Python-Client/1.0",
    "Accept": "application/json"
}

if API_KEY:
    HEADERS["Authorization"] = f"Bearer {API_KEY}"
```

## 🌱 1. API Crop Health - Santé des Cultures

### Vérification du service

```python
def check_crop_health_service():
    """Vérifie si le service Crop Health est disponible"""
    try:
        response = requests.get(f"{BASE_URL}/crop-health/ping", headers=HEADERS)
        print(f"Service Status: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Erreur: {e}")
        return False

# Test
check_crop_health_service()
```

### Analyse d'image - Prédiction binaire

```python
def analyze_crop_binary(image_path):
    """Analyse binaire: sain/malade"""
    try:
        with open(image_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                f"{BASE_URL}/crop-health/predictions/binary",
                files=files,
                headers={k: v for k, v in HEADERS.items() if k != 'Accept'}
            )
        
        if response.status_code == 200:
            result = response.json()
            print(f"Résultat binaire: {result['prediction']}")
            print(f"Confiance: {result['confidence']:.2f}")
            print(f"Temps de traitement: {result['processing_time']:.2f}s")
            return result
        else:
            print(f"Erreur: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Erreur: {e}")
        return None

# Test
# analyze_crop_binary("path/to/your/crop_image.jpg")
```

### Analyse détaillée - Classification multi-classes

```python
def analyze_crop_detailed(image_path, model="single-HLT"):
    """Analyse détaillée avec 13 classes de maladies"""
    try:
        with open(image_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                f"{BASE_URL}/crop-health/predictions/{model}",
                files=files,
                headers={k: v for k, v in HEADERS.items() if k != 'Accept'}
            )
        
        if response.status_code == 200:
            result = response.json()
            print(f"Maladie détectée: {result.get('disease_type', 'N/A')}")
            print(f"Confiance: {result.get('confidence', 0):.2f}")
            print(f"Recommandations: {result.get('recommendations', 'Aucune')}")
            return result
        else:
            print(f"Erreur: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Erreur: {e}")
        return None

# Test avec différents modèles
# analyze_crop_detailed("image.jpg", "single-HLT")
# analyze_crop_detailed("image.jpg", "multi-HLT")
```

### Analyse batch (plusieurs images)

```python
async def analyze_batch_crops(image_paths):
    """Analyse plusieurs images en parallèle"""
    async def analyze_single(session, image_path):
        try:
            with open(image_path, 'rb') as f:
                data = aiohttp.FormData()
                data.add_field('file', f, filename=image_path.split('/')[-1])
                
                async with session.post(
                    f"{BASE_URL}/crop-health/predictions/binary",
                    data=data
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        return {"file": image_path, "result": result}
                    else:
                        return {"file": image_path, "error": f"Status {response.status}"}
        except Exception as e:
            return {"file": image_path, "error": str(e)}
    
    async with aiohttp.ClientSession(headers=HEADERS) as session:
        tasks = [analyze_single(session, path) for path in image_paths]
        results = await asyncio.gather(*tasks)
        return results

# Test
# image_list = ["image1.jpg", "image2.jpg", "image3.jpg"]
# results = asyncio.run(analyze_batch_crops(image_list))
# print(results)
```

## 🌤️ 2. API Agriculture - Données Agricoles

### Données météorologiques

```python
def get_weather_data(lat, lon, data_type="current"):
    """Récupère les données météorologiques"""
    endpoints = {
        "current": f"{BASE_URL}/agriculture/weather/current",
        "forecast": f"{BASE_URL}/agriculture/weather/forecast",
        "historical": f"{BASE_URL}/agriculture/weather/historical"
    }
    
    params = {
        "lat": lat,
        "lon": lon
    }
    
    if data_type == "historical":
        # Données des 30 derniers jours
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        params["start_date"] = start_date.strftime("%Y-%m-%d")
        params["end_date"] = end_date.strftime("%Y-%m-%d")
    
    try:
        response = requests.get(endpoints[data_type], params=params, headers=HEADERS)
        if response.status_code == 200:
            data = response.json()
            print(f"Données météo {data_type}:")
            print(f"Température: {data.get('temperature', 'N/A')}°C")
            print(f"Humidité: {data.get('humidity', 'N/A')}%")
            print(f"Précipitations: {data.get('precipitation', 'N/A')}mm")
            return data
        else:
            print(f"Erreur: {response.status_code}")
            return None
    except Exception as e:
        print(f"Erreur: {e}")
        return None

# Test pour Cotonou, Bénin
# get_weather_data(6.496, 2.629, "current")
# get_weather_data(6.496, 2.629, "forecast")
```

### Alertes d'inondation

```python
def get_flood_alerts(lat, lon):
    """Récupère les alertes d'inondation"""
    try:
        response = requests.get(
            f"{BASE_URL}/agriculture/floods/alerts",
            params={"lat": lat, "lon": lon},
            headers=HEADERS
        )
        
        if response.status_code == 200:
            alerts = response.json()
            print(f"Alertes d'inondation: {len(alerts.get('alerts', []))}")
            for alert in alerts.get('alerts', []):
                print(f"- Niveau: {alert.get('level')}, Probabilité: {alert.get('probability')}")
            return alerts
        else:
            print(f"Erreur: {response.status_code}")
            return None
    except Exception as e:
        print(f"Erreur: {e}")
        return None

# Test
# get_flood_alerts(6.496, 2.629)
```

### Données de déforestation

```python
def get_deforestation_data(lat, lon, radius=10):
    """Récupère les données de déforestation"""
    endpoints = {
        "alerts": f"{BASE_URL}/agriculture/deforestation/alerts",
        "trends": f"{BASE_URL}/agriculture/deforestation/trends",
        "hotspots": f"{BASE_URL}/agriculture/deforestation/hotspots"
    }
    
    params = {
        "lat": lat,
        "lon": lon,
        "radius": radius  # rayon en km
    }
    
    results = {}
    for key, url in endpoints.items():
        try:
            response = requests.get(url, params=params, headers=HEADERS)
            if response.status_code == 200:
                results[key] = response.json()
                print(f"Données {key}: {len(results[key].get('data', []))} entrées")
        except Exception as e:
            print(f"Erreur pour {key}: {e}")
    
    return results

# Test
# deforestation_data = get_deforestation_data(6.496, 2.629)
```

## 🌿 3. API GBIF - Biodiversité

### Recherche d'espèces nuisibles

```python
def search_pest_species(country="BJ", pest_name=""):
    """Recherche d'espèces nuisibles"""
    try:
        params = {
            "country": country,
            "hasCoordinate": "true",
            "limit": 20
        }
        
        if pest_name:
            params["q"] = pest_name
        
        response = requests.get(f"{GBIF_URL}/occurrence/search", params=params, headers=HEADERS)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Trouvé {data.get('count', 0)} occurrences")
            
            for occurrence in data.get('results', []):
                print(f"- {occurrence.get('scientificName', 'N/A')}")
                print(f"  Lieu: {occurrence.get('locality', 'N/A')}")
                print(f"  Date: {occurrence.get('eventDate', 'N/A')}")
                print()
            
            return data
        else:
            print(f"Erreur: {response.status_code}")
            return None
    except Exception as e:
        print(f"Erreur: {e}")
        return None

# Test
# search_pest_species("BJ", "Spodoptera")  # Chenille légionnaire
```

### Informations taxonomiques

```python
def get_species_info(species_key):
    """Récupère les informations détaillées d'une espèce"""
    try:
        response = requests.get(f"{GBIF_URL}/species/{species_key}", headers=HEADERS)
        
        if response.status_code == 200:
            species = response.json()
            print(f"Nom scientifique: {species.get('scientificName', 'N/A')}")
            print(f"Nom vernaculaire: {species.get('vernacularName', 'N/A')}")
            print(f"Famille: {species.get('family', 'N/A')}")
            print(f"Statut: {species.get('taxonomicStatus', 'N/A')}")
            return species
        else:
            print(f"Erreur: {response.status_code}")
            return None
    except Exception as e:
        print(f"Erreur: {e}")
        return None

# Test
# get_species_info("1234567")  # Remplacer par un vrai ID
```

## 🏞️ 4. API Sols - Propriétés du Sol

### Propriétés physico-chimiques

```python
def get_soil_properties(lat, lon, depth="0-30"):
    """Récupère les propriétés du sol"""
    try:
        params = {
            "lat": lat,
            "lon": lon,
            "depth": depth,
            "variables": "ph,organic_matter,texture,cec"
        }
        
        response = requests.get(f"{BASE_URL}/soils/properties", params=params, headers=HEADERS)
        
        if response.status_code == 200:
            soil_data = response.json()
            print(f"Propriétés du sol ({depth}cm):")
            print(f"pH: {soil_data.get('ph', 'N/A')}")
            print(f"Matière organique: {soil_data.get('organic_matter', 'N/A')}%")
            print(f"Texture: {soil_data.get('texture', 'N/A')}")
            print(f"CEC: {soil_data.get('cec', 'N/A')} cmol/kg")
            return soil_data
        else:
            print(f"Erreur: {response.status_code}")
            return None
    except Exception as e:
        print(f"Erreur: {e}")
        return None

# Test
# get_soil_properties(6.496, 2.629, "0-30")
# get_soil_properties(6.496, 2.629, "30-60")
```

### Cartographie des sols

```python
def get_soil_maps(lat, lon, resolution="1km"):
    """Récupère les cartes de sols"""
    try:
        params = {
            "lat": lat,
            "lon": lon,
            "resolution": resolution,
            "format": "json"
        }
        
        response = requests.get(f"{BASE_URL}/soils/maps", params=params, headers=HEADERS)
        
        if response.status_code == 200:
            map_data = response.json()
            print(f"Carte des sols (résolution {resolution}):")
            print(f"Type de sol dominant: {map_data.get('dominant_soil_type', 'N/A')}")
            print(f"Classe de drainage: {map_data.get('drainage_class', 'N/A')}")
            return map_data
        else:
            print(f"Erreur: {response.status_code}")
            return None
    except Exception as e:
        print(f"Erreur: {e}")
        return None

# Test
# get_soil_maps(6.496, 2.629, "1km")
```

## 🗺️ 5. API Global Field ID - Identification de Parcelles

### Identification automatique de parcelles

```python
def identify_field(lat, lon):
    """Identifie automatiquement une parcelle"""
    try:
        params = {
            "lat": lat,
            "lon": lon,
            "buffer": 100  # buffer en mètres
        }
        
        response = requests.get(f"{BASE_URL}/fields/identify", params=params, headers=HEADERS)
        
        if response.status_code == 200:
            field_data = response.json()
            print(f"Parcelle identifiée:")
            print(f"ID: {field_data.get('field_id', 'N/A')}")
            print(f"Surface: {field_data.get('area_hectares', 'N/A')} ha")
            print(f"Culture dominante: {field_data.get('dominant_crop', 'N/A')}")
            return field_data
        else:
            print(f"Erreur: {response.status_code}")
            return None
    except Exception as e:
        print(f"Erreur: {e}")
        return None

# Test
# identify_field(6.496, 2.629)
```

### Délimitation de parcelles

```python
def delineate_field(coordinates):
    """Délimite une parcelle à partir de coordonnées"""
    try:
        payload = {
            "coordinates": coordinates,
            "method": "auto",
            "resolution": "10m"
        }
        
        response = requests.post(
            f"{BASE_URL}/fields/delineate",
            json=payload,
            headers=HEADERS
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"Délimitation réussie:")
            print(f"Surface calculée: {result.get('area_hectares', 'N/A')} ha")
            print(f"Périmètre: {result.get('perimeter_meters', 'N/A')} m")
            return result
        else:
            print(f"Erreur: {response.status_code}")
            return None
    except Exception as e:
        print(f"Erreur: {e}")
        return None

# Test avec coordonnées d'exemple
# coords = [[2.62, 6.49], [2.63, 6.49], [2.63, 6.50], [2.62, 6.50], [2.62, 6.49]]
# delineate_field(coords)
```

## 🔧 6. Fonctions Utilitaires et Analyses Avancées

### Analyse complète d'une parcelle

```python
def complete_field_analysis(lat, lon, image_path=None):
    """Analyse complète d'une parcelle agricole"""
    print(f"=== Analyse complète pour {lat}, {lon} ===")
    
    results = {}
    
    # 1. Données météorologiques
    print("\n1. Données météorologiques:")
    results['weather'] = get_weather_data(lat, lon, "current")
    
    # 2. Propriétés du sol
    print("\n2. Propriétés du sol:")
    results['soil'] = get_soil_properties(lat, lon)
    
    # 3. Alertes d'inondation
    print("\n3. Alertes d'inondation:")
    results['flood_alerts'] = get_flood_alerts(lat, lon)
    
    # 4. Identification de parcelle
    print("\n4. Identification de parcelle:")
    results['field_info'] = identify_field(lat, lon)
    
    # 5. Données de déforestation
    print("\n5. Données de déforestation:")
    results['deforestation'] = get_deforestation_data(lat, lon)
    
    # 6. Analyse d'image si fournie
    if image_path:
        print("\n6. Analyse de santé des cultures:")
        results['crop_health'] = analyze_crop_detailed(image_path)
    
    # 7. Recherche d'espèces nuisibles
    print("\n7. Espèces nuisibles locales:")
    results['pest_species'] = search_pest_species("BJ")
    
    return results

# Test complet
# complete_analysis = complete_field_analysis(6.496, 2.629, "crop_image.jpg")
```

### Système de monitoring

```python
class CropMonitoringSystem:
    """Système de monitoring des cultures"""
    
    def __init__(self, fields):
        self.fields = fields  # Liste de dictionnaires {id, lat, lon, crop_type}
    
    def monitor_all_fields(self):
        """Surveille tous les champs"""
        results = {}
        
        for field in self.fields:
            print(f"\n=== Monitoring du champ {field['id']} ===")
            
            # Données météo
            weather = get_weather_data(field['lat'], field['lon'])
            
            # Alertes
            flood_alerts = get_flood_alerts(field['lat'], field['lon'])
            
            # Propriétés du sol
            soil = get_soil_properties(field['lat'], field['lon'])
            
            results[field['id']] = {
                'weather': weather,
                'flood_alerts': flood_alerts,
                'soil': soil,
                'crop_type': field['crop_type']
            }
        
        return results
    
    def generate_recommendations(self, field_id, monitoring_data):
        """Génère des recommandations basées sur les données"""
        data = monitoring_data[field_id]
        recommendations = []
        
        # Recommandations météo
        if data['weather'] and data['weather'].get('precipitation', 0) > 50:
            recommendations.append("Risque de maladie fongique - surveiller les feuilles")
        
        # Recommandations inondation
        if data['flood_alerts'] and len(data['flood_alerts'].get('alerts', [])) > 0:
            recommendations.append("Risque d'inondation - préparer le drainage")
        
        # Recommandations sol
        if data['soil'] and data['soil'].get('ph', 7) < 5.5:
            recommendations.append("Sol acide - envisager un chaulage")
        
        return recommendations

# Test du système de monitoring
# fields = [
#     {"id": "field_1", "lat": 6.496, "lon": 2.629, "crop_type": "maize"},
#     {"id": "field_2", "lat": 6.500, "lon": 2.635, "crop_type": "cassava"}
# ]
# 
# monitor = CropMonitoringSystem(fields)
# results = monitor.monitor_all_fields()
# 
# for field_id in results:
#     recommendations = monitor.generate_recommendations(field_id, results)
#     print(f"Recommandations pour {field_id}: {recommendations}")
```

### Gestion des erreurs et retry

```python
import time
from functools import wraps

def retry_on_failure(max_retries=3, delay=1):
    """Décorateur pour réessayer en cas d'échec"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_retries - 1:
                        print(f"Tentative {attempt + 1} échouée, retry dans {delay}s...")
                        time.sleep(delay)
                    else:
                        print(f"Toutes les tentatives ont échoué: {e}")
            
            raise last_exception
        return wrapper
    return decorator

@retry_on_failure(max_retries=3, delay=2)
def robust_crop_analysis(image_path):
    """Analyse robuste avec retry automatique"""
    return analyze_crop_detailed(image_path)

# Test
# result = robust_crop_analysis("crop_image.jpg")
```

## 🎯 7. Exemples d'Usage Concrets

### Pour les agriculteurs au Bénin

```python
def benin_farmer_toolkit(lat, lon, crop_type="maize"):
    """Kit d'outils pour les agriculteurs béninois"""
    print(f"=== Kit Agriculteur Bénin - {crop_type.upper()} ===")
    
    # Météo locale
    weather = get_weather_data(lat, lon)
    if weather:
        temp = weather.get('temperature', 0)
        humidity = weather.get('humidity', 0)
        
        if temp > 35:
            print("🌡️  ALERTE: Température élevée - arroser si possible")
        if humidity > 80:
            print("💧 ALERTE: Humidité élevée - surveiller les maladies")
    
    # Spécifique au maïs
    if crop_type == "maize":
        pest_data = search_pest_species("BJ", "Spodoptera")
        if pest_data and pest_data.get('count', 0) > 0:
            print("🐛 ALERTE: Chenille légionnaire détectée dans la région")
    
    # Spécifique au manioc
    elif crop_type == "cassava":
        pest_data = search_pest_species("BJ", "Bemisia")
        if pest_data and pest_data.get('count', 0) > 0:
            print("🐛 ALERTE: Mouche blanche détectée - vecteur de virus")
    
    # Données du sol
    soil = get_soil_properties(lat, lon)
    if soil:
        ph = soil.get('ph', 7)
        if ph < 5.5:
            print("🌱 CONSEIL: Sol acide - utiliser de la chaux")
        elif ph > 8:
            print("🌱 CONSEIL: Sol basique - utiliser du compost")
    
    return {
        'weather': weather,
        'soil': soil,
        'crop_advice': f"Conseils pour {crop_type} générés"
    }

# Test pour un agriculteur à Cotonou
# benin_farmer_toolkit(6.496, 2.629, "maize")
```

### Pour les chercheurs

```python
def research_data_collection(region_bounds, crops=["maize", "cassava"]):
    """Collecte de données pour la recherche"""
    print("=== Collecte de données de recherche ===")
    
    # Définir une grille de points
    lat_min, lat_max = region_bounds['lat']
    lon_min, lon_max = region_bounds['lon']
    
    grid_points = []
    for lat in [lat_min, (lat_min + lat_max) / 2, lat_max]:
        for lon in [lon_min, (lon_min + lon_max) / 2, lon_max]:
            grid_points.append((lat, lon))
    
    research_data = {}
    
    for i, (lat, lon) in enumerate(grid_points):
        print(f"Point {i+1}: {lat:.3f}, {lon:.3f}")
        
        research_data[f"point_{i+1}"] = {
            'coordinates': (lat, lon),
            'weather': get_weather_data(lat, lon),
            'soil': get_soil_properties(lat, lon),
            'field_info': identify_field(lat, lon)
        }
    
    return research_data

# Test pour une région du Bénin
# bounds = {'lat': (6.4, 6.6), 'lon': (2.6, 2.8)}
# research_data = research_data_collection(bounds)
```

## 🚀 8. Script Principal de Test

```python
def main():
    """Script principal pour tester toutes les fonctionnalités"""
    print("🌍 Test complet des APIs OpenEPI")
    print("=" * 50)
    
    # Coordonnées de test (Cotonou, Bénin)
    test_lat, test_lon = 6.496, 2.629
    
    # 1. Test service Crop Health
    print("\n1. Test Crop Health Service:")
    if check_crop_health_service():
        print("✅ Service actif")
    else:
        print("❌ Service inactif")
    
    # 2. Test données météo
    print("\n2. Test données météorologiques:")
    weather_data = get_weather_data(test_lat, test_lon)
    if weather_data:
        print("✅ Données météo récupérées")
    
    # 3. Test données de sol
    print("\n3. Test données de sol:")
    soil_data = get_soil_properties(test_lat, test_lon)
    if soil_data:
        print("✅ Données de sol récupérées")
    
    # 4. Test GBIF
    print("\n4. Test données GBIF:")
    gbif_data = search_pest_species("BJ", "Spodoptera")
    if gbif_data:
        print("✅ Données GBIF récupérées")
    
    # 5. Test identification de parcelle
    print("\n5. Test identification de parcelle:")
    field_data = identify_field(test_lat, test_lon)
    if field_data:
        print("✅ Parcelle identifiée")
    
    # 6. Test alertes
    print("\n6. Test alertes d'inondation:")
    flood_data = get_flood_alerts(test_lat, test_lon)
    if flood_data:
        print("✅ Alertes récupérées")
    
    print("\n🎉 Tests terminés!")

if __name__ == "__main__":
    main()
```

## 📚 Notes Importantes

### Classes de maladies supportées:
- **HLT**: Plante saine
- **MLN**: Nécrose létale du maïs
- **MSV**: Virus de la striure du maïs
- **MLB**: Brûlure des feuilles du maïs
- **BR**: Rouille des haricots
- **ALS**: Tache angulaire des feuilles
- **CBSD**: Maladie des stries brunes du manioc
- **CMD**: Maladie de la mosaïque du manioc
- **CSSVD**: Maladie du gonflement des pousses du cacao
- **ANT**: Anthracnose du cacao
- **BS**: Sigatoka noire des bananes
- **FW**: Fusariose des bananes
- **FAW**: Chenille légionnaire d'automne

### Limites de taux:
- **Sans authentification**: 100 requêtes/heure
- **Avec clé API**: Limites augmentées
- **Taille d'image**: Maximum 10MB, recommandé 224x224 pixels

### Cultures supportées:
- Maïs, Manioc, Haricots, Cacao, Bananes
- Extension prévue: Riz, Mil, Sorgho, Cultures maraîchères

## 🔗 Ressources

- **Documentation officielle**: https://docs.openepi.io
- **Dashboard web**: https://app.openepi.io
- **Support**: https://support.openepi.io
- **GBIF**: https://www.gbif.org

---

*Ce guide couvre toutes les fonctionnalités principales d'OpenEPI. Adaptez les exemples selon vos besoins spécifiques!*