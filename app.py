from flask import Flask, render_template, request, session, redirect, url_for


app = Flask(__name__)
app.secret_key = 'todowebapp_secret_key'

@app.route('/')
def home():
    if 'email' in session:
        return render_template('dashboard.html', email=session['email'])
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['email'] = request.form['email']
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('email', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
