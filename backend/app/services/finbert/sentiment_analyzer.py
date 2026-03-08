from app.services.finbert.model_loader import get_finbert
from app.utils.logger_setup  import get_logger

logger = get_logger("sentiment-analyzer")


def analizar_sentimiento(noticias):

    try:
        logger.info("Pasando las noticias por FinBERT...")

        modelo = get_finbert()
        resultado = modelo(noticias)

        return resultado
    
    except Exception as e:
        logger.error(f"Algo ha ido mal al pasarle las noticias a FinBERT: {e}")
        return []
