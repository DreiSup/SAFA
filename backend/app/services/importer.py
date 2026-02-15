import pandas as pd
from datetime import datetime
from app.extensions import db 
from app.models.transaction import Transaccion

def process_file(file_path):
    """ Lee un archivo, limpia los datos y los guarda en la base de datos """

    # 1. CARGAR UN ARCHIVO SEGÚN SU EXTENSIÓN
    if file_path.endswith('.csv'): 
        #con pandas
        df = pd.read_csv(file_path)
    else:
        #requiere la librería 'openpyxl'
        df = pd.read_excel(file_path)

    # 2. LIMPIEZA: IGNORAMOS FILAS DONDE FALTEN DATOS CRÍTICOS
    df = df.dropna(subset=['fecha', 'concepto', 'monto']) 

    count = 0 
    # 3. ITERAMOS SOBRE CADA FILA DE LA TABLA DE PANDAS
    for _, row in df.iterrows():
        #convierte el texto de la fecha a un objeto 'date' real de Python
        fecha_dt = row['fecha']
        if isinstance(fecha_dt, str):
            #formato año-mes-dia
            fecha_dt = datetime.strptime(fecha_dt, '%Y-%m-%d').date()

        # 4. MAPEO FILA AL MODELO DE SQLAlchemy

        nueva_trans = Transaccion(
            fecha=fecha_dt,
            concepto=row['concepto'],
            monto=float(row['monto']),
            categoria_manual=row.get('categoria', 'Sin categoría')
        ) 

        #añade a la sesión
        db.session.add(nueva_trans)
        count += 1

    # 5. VUELCA LA BANDEJA A LA BASE DE DATOS (COMMIT FINAL)
    db.session.commit()
    return count