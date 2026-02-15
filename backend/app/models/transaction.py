from app.extensions import db
from datetime import datetime

class Transaccion(db.Model):
    __tablename__ = 'transacciones'

    id = db.Column(db.Integer, primary_key=True)
    fecha = db.Column(db.Date, nullable=False)
    concepto = db.Column(db.String(200), nullable=False)
    monto = db.Column(db.Float, nullable=False)
    
    # Categoría Manual (la que viene del banco o pones tú)
    categoria_manual = db.Column(db.String(100), nullable=True)
    
    # Categoría IA (la que SAFA predecirá en el futuro)
    categoria_ia = db.Column(db.String(100), nullable=True)
    
    # Probabilidad de acierto de la IA (0.0 a 1.0)
    confianza_ia = db.Column(db.Float, default=0.0)

    def __repr__(self):
        return f'<Transaccion {self.concepto} - {self.monto}€>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'fecha': self.fecha.strftime('%Y-%m-%d'),
            'concepto': self.concepto,
            'monto': self.monto,
            'categoria_manual': self.categoria_manual,
            'categoria_ia': self.categoria_ia
        }