# backend/app/swagger_config.py

swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec_1',
            "route": '/apispec_1.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/",
    "ui_params": {
            #"operationsSorter": "method", # Ordena por tipo: GET > POST > PUT > DELETE
            "tagsSorter": "alpha"         # Ordena los grupos (Micro, Macro) alfabéticamente
        }

}

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "SAFA API - Inteligencia Financiera",
        "description": "API para el control de finanzas personales (Micro) y análisis de mercado (Macro).",
        "version": "1.0.0",
        "contact": {
            "name": "SAFA Support",
            "url": "https://github.com/tu-usuario/SAFA",
        }
    },
    "basePath": "/api",  # Esto asegura que Swagger sepa que todo cuelga de /api
    "schemes": [
        "http",
        "https"
    ]
}