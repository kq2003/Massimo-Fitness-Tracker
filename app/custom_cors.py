from flask_cors import cross_origin

# Predefined origins list
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:5000",
    "https://massimo-frontend-bl4mezr98-aos-projects-2be27b28.vercel.app",
    "https://massimo-frontend-4ot1an-aos-projects-2be27b28.vercel.app",
    "https://massimo-frontend-aos-projects-2be27b28.vercel.app",
    "https://massimo-frontend.vercel.app",
    "https://massimo-4er7268k5-aos-projects-2be27b28.vercel.app",
    r"https://.*\.vercel\.app"
]

def use_cors():
    """
    Returns a cross_origin decorator with predefined allowed origins.
    Supports credentials for secure cookie handling.
    """
    return cross_origin(supports_credentials=True, origins=ALLOWED_ORIGINS)
