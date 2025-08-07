from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///game_results.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class GameResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    result = db.Column(db.String(10))
    time = db.Column(db.Integer)

@app.route('/')
def index():
    # allplayers = GameResult.query.filter_by(result='win').all()
    allplayers = GameResult.query.filter_by(result='win').order_by(GameResult.time.asc()).all()

    return render_template('game.html', allplayers = allplayers)

@app.route('/gameover', methods=['POST'])
def gameover():
    data = request.get_json()
    name = data.get('name')
    result = data.get('result')
    time = data.get('time')

    if name and result and time is not None:
        game_result = GameResult(name=name, result=result, time=time)
        db.session.add(game_result)
        db.session.commit()
        



@app.route('/leaderboard')
def leaderboard():
    top_scores = GameResult.query.order_by(GameResult.time).limit(10).all()
    return render_template('leaderboard.html', scores=top_scores)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5004)
