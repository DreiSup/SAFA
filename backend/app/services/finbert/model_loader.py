from transformers import pipeline
from app.utils.logger_setup  import get_logger

logger = get_logger("finbert.loader")

_model = None

def get_finbert():
    global _model

    if _model is None:
        logger.info("Cargando FinBERT en memoria (primera vez)...")
        _model = pipeline(
            task="text-classification",
            model="ProsusAI/finbert",
            tokenizer="ProsusAI/finbert"
        )
        logger.info("FinBERT listo.")

    return _model