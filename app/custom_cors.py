from flask_cors import cross_origin

# Predefined origins list
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://massimo-frontend-7mbcpsyrs-aos-projects-2be27b28.vercel.app",
    "https://massimo-frontend-4ot1an-aos-projects-2be27b28.vercel.app",
    "https://massimo-frontend.vercel.app"
]

def use_cors():
    """
    Returns a cross_origin decorator with predefined allowed origins.
    Supports credentials for secure cookie handling.
    """
    return cross_origin(supports_credentials=True, origins=ALLOWED_ORIGINS)
