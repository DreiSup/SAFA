import logging
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LOGS_DIR = os.path.join(BASE_DIR, "logs")

def get_logger(name):
    """
    Crea y configura un logger estándar para toda la plataforma SAFA.
    Escribe tanto en la consola como en un archivo persistente.
    """
    # 1. Creamos la carpeta 'logs' si no existe
    os.makedirs(LOGS_DIR, exist_ok=True)

    # 2. Inicializamos el logger con el nombre del script que lo llama
    logger = logging.getLogger(name)

    logger.setLevel(logging.DEBUG) # Capturar desde INFO hacia arriba (INFO, WARNING, ERROR)


    # Evitamos que los mensajes se dupliquen si importamos esto varias veces
    if not logger.handlers:
        # 3. Definimos el formato: [FECHA] [NIVEL] [SCRIPT] - Mensaje
        formato = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

        
        # 4. Canal 1: Mostrar por pantalla (sustituye al print)
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formato)
        logger.addHandler(console_handler)

        info_path=os.path.join(LOGS_DIR, "info.log")
        error_path=os.path.join(LOGS_DIR, "error.log")

        # 5. Canal 2: Escribir en el disco duro (tu caja negra de emergencias)
        file_handler = logging.FileHandler(info_path, encoding='utf-8')
        file_handler.setFormatter(formato)

        file_handler.setLevel(logging.INFO)
        
        logger.addHandler(file_handler)
        
        error_handler = logging.FileHandler(error_path, encoding='utf-8')
        error_handler.setFormatter(formato)
        error_handler.setLevel(logging.ERROR)

        logger.addHandler(error_handler)

    return logger