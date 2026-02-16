import os 
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.services.importer import process_file
from app.models.transaction import Transaccion
from app.extensions import db
from sqlalchemy import func
from datetime import datetime, timedelta
import calendar
from flasgger import swag_from

finance_bp = Blueprint('finance', __name__, url_prefix='/api/finance')

#carpeta temporal
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Esto detecta dónde está 'finance.py' y construye la ruta hacia 'docs'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOCS_DIR = os.path.join(BASE_DIR, '..', 'docs', 'finance')

@finance_bp.route('/transactions', methods=['GET'])
@swag_from(os.path.join(DOCS_DIR, 'get_transactions.yml'))
def get_transactions():
    """ Todas las transacciones de la db """
    try:
        transactions = Transaccion.query.order_by(Transaccion.fecha.desc()).all()

        output = []
        for t in transactions:
            output.append({
                "id": t.id,
                "fecha": t.fecha.strftime('%Y-%m-%d'),
                "concepto": t.concepto,
                "monto": t.monto,
                "categoria": t.categoria_manual

            })

        return jsonify(output), 200

    except Exception as e:
        return jsonify({"error": f"NO se pudieron recuperar las transacciones: {str(e)}"}), 500



@finance_bp.route('/upload', methods=['POST'])
@swag_from(os.path.join(DOCS_DIR, 'upload_file.yml'))
def upload_file():

    if 'file' not in request.files:
        return jsonify({"error": "No se encontró la clave 'file' en la petición"}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "NO has seleccionado ningún archivo"}), 400
    
    filename = secure_filename(file.filename)
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    try:
        total_importado = process_file(path)
        return jsonify({
            "status": "success",
            "message" : f"Se han importado {total_importado} transacciones correctamente"
        }), 201
    except Exception as e:
        return jsonify({"error": f"Error procesando el archivo: {str(e)}"}), 500
    finally:
        if os.path.exists(path):
            os.remove(path)



@finance_bp.route('/transactions', methods=['DELETE'])
@swag_from(os.path.join(DOCS_DIR, 'delete_transactions.yml'))
def delete_all_transactions():
    try:

        num_borrados=db.session.query(Transaccion).delete()

        db.session.commit()

        return jsonify({
            "message": "Base de datos limpiada correctamente", 
            "total_borrado": num_borrados
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al eliminar todas las transacciones"}), 500


@finance_bp.route('/transactions/<int:transaction_id>', methods=['DELETE'])
@swag_from(os.path.join(DOCS_DIR, 'delete_single_transaction.yml'))
def delete_transaction(transaction_id):
    """ Elimina una transaction específica """
    try:

        transaction = Transaccion.query.get(transaction_id)

        if not transaction: 
            return jsonify({"error": "Transacción no encontrada"}), 404
        
        db.session.delete(transaction)
        db.session.commit()

        return jsonify({"message": f"Transaction {transaction_id} eliminada correctamente"})

    except Exception as e:  
        db.sesison.rollback()
        return jsonify({"error": f"Error al eliminar: {str(e)}"}), 500
    

@finance_bp.route('/dashboard', methods=['GET'])
@swag_from(os.path.join(DOCS_DIR, 'get_dashboard.yml'))
def get_dashboard_data():
    """ Devuelve métricas agregadas (balance total y gastos por categoría)"""
    try:

        # 1. Capturar el parámetro 'mes' de la URL (si existe)
        mes_param = request.args.get('mes') # Formato esperado: 'YYYY-MM'

        # 1.CALCULO DE BALANCE TOTAL
        # SQL EQUIVALENTE: SELECT SUM(monto) FROM transacciones;
        # .scalar() se usa cuando solo esperamos un único número, no una lista
        total_balance = db.session.query(func.sum(Transaccion.monto)).scalar() or 0.0

        # 2. GASTOS POR CATEGORIA
        # SQL EQUIVALENTE: SELECT categoria_manual, SUM(monto) FROM transacciones GROUP BY categoria_manual;
        categoria_query = db.session.query(
            Transaccion.categoria_manual,
            func.sum(Transaccion.monto).label('total')
        ).group_by(Transaccion.categoria_manual).all()

        # LISTA DE RESULTADO A JSON
        desglose_categorias = []
        for nombre_categoria, total_monto in categoria_query:
            desglose_categorias.append({
                "categoria": nombre_categoria,
                "total": float(total_monto)
            })

        return jsonify({
            "balance_total": float(total_balance),
            "desglose_por_categoria": desglose_categorias
        }), 200

    except Exception as e:
        return jsonify({"error": f"Error calculando dashboard: {str(e)}"}), 500