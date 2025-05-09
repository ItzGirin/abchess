import os
import chess
import chess.engine
from flask import Flask, request, jsonify

app = Flask(__name__)

# Menggunakan path relatif untuk mengakses engine.exe
current_dir = os.path.dirname(os.path.abspath(__file__))  # Mendapatkan direktori saat ini
engine_path = os.path.join(current_dir, "program", "engine.exe")  # Menggabungkan path

# Memastikan file engine ada
if not os.path.isfile(engine_path):
    raise FileNotFoundError(f"Engine not found at: {engine_path}")

engine = chess.engine.SimpleEngine.popen_uci(engine_path)

# Inisialisasi papan catur
board = chess.Board()

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    board.set_fen(data['fen'])
    result = engine.analyse(board, chess.engine.Limit(time=1.0))
    best_move = result['pv'][0] if 'pv' in result and result['pv'] else None
    return jsonify(bestMove=best_move.uci() if best_move else "No valid move")

@app.route('/move', methods=['POST'])
def move():
    data = request.json
    move = chess.Move.from_uci(data['move'])
    if move in board.legal_moves:
        board.push(move)
        return jsonify(fen=board.fen())
    return jsonify(error="Invalid move"), 400

if __name__ == '__main__':
    app.run(debug=True)
