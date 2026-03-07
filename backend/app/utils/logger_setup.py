import logging
import os

def get_logger(name):
    """
    Crea y configura un logger estándar para toda la plataforma SAFA.
    Escribe tanto en la consola como en un archivo persistente.
    """
    # 1. Creamos la carpeta 'logs' si no existe
    if not os.path.exists('logs'):
        os.makedirs('logs')

    # 2. Inicializamos el logger con el nombre del script que lo llama
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO) # Capturar desde INFO hacia arriba (INFO, WARNING, ERROR)

    # Evitamos que los mensajes se dupliquen si importamos esto varias veces
    if not logger.handlers:
        # 3. Definimos el formato: [FECHA] [NIVEL] [SCRIPT] - Mensaje
        formato = logging.Formatter('[%(asctime)s] [%(levelname)s] [%(name)s] - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

        # 4. Canal 1: Mostrar por pantalla (sustituye al print)
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formato)
        logger.addHandler(console_handler)

        # 5. Canal 2: Escribir en el disco duro (tu caja negra de emergencias)
        file_handler = logging.FileHandler('logs/safa_macro.log', encoding='utf-8')
        file_handler.setFormatter(formato)
        logger.addHandler(file_handler)

    return logger