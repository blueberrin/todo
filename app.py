from flask import Flask, render_template, request, session, redirect, url_for, jsonify


app = Flask(__name__)
app.secret_key = 'todowebapp_secret_key'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get("email")
        session["email"] = email
        print("Email stored in session:", session.get("email"))
        return jsonify({'success': True})
    else:
        return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'email' in session:
        email = session['email']
        return render_template('dashboard.html', email=email)
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('email', None)
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
