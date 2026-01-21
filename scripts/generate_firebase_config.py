import os
import json

def generate_google_services_json():
    # Load .env file
    env = {}
    env_path = os.path.join(os.getcwd(), '.env')
    
    if not os.path.exists(env_path):
        print("Error: .env file not found.")
        return

    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                key, value = line.split('=', 1)
                env[key] = value

    # Mapping from .env to google-services.json structure
    # Note: Using the values we just added to .env
    config = {
        "project_info": {
            "project_number": env.get("FIREBASE_MESSAGING_SENDER_ID", ""),
            "project_id": env.get("FIREBASE_PROJECT_ID", ""),
            "storage_bucket": env.get("FIREBASE_STORAGE_BUCKET", "")
        },
        "client": [
            {
                "client_info": {
                    "mobilesdk_app_id": env.get("FIREBASE_ANDROID_APP_ID", ""),
                    "android_client_info": {
                        "package_name": "com.example.designwear"
                    }
                },
                "oauth_client": [],
                "api_key": [
                    {
                        "current_key": env.get("FIREBASE_ANDROID_API_KEY", "")
                    }
                ],
                "services": {
                    "appinvite_service": {
                        "other_platform_oauth_client": []
                    }
                }
            }
        ],
        "configuration_version": "1"
    }

    output_path = os.path.join(os.getcwd(), 'android', 'app', 'google-services.json')
    
    with open(output_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"Successfully generated {output_path}")

if __name__ == "__main__":
    generate_google_services_json()
