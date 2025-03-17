#!/bin/bash

# Set up PostgreSQL
echo "Setting up PostgreSQL..."
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Prompt for database credentials securely
echo "Setting up database credentials..."
read -p "Enter PostgreSQL username [netxplore]: " DB_USER
DB_USER=${DB_USER:-netxplore}

# Use -s flag to hide password input
read -s -p "Enter PostgreSQL password: " DB_PASSWORD
echo
# Confirm password
read -s -p "Confirm PostgreSQL password: " DB_PASSWORD_CONFIRM
echo

# Validate password match
while [[ "$DB_PASSWORD" != "$DB_PASSWORD_CONFIRM" ]]; do
    echo "Passwords do not match. Please try again."
    read -s -p "Enter PostgreSQL password: " DB_PASSWORD
    echo
    read -s -p "Confirm PostgreSQL password: " DB_PASSWORD_CONFIRM
    echo
done

# Create database and user
echo "Creating database and user..."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE netxplore;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE netxplore TO $DB_USER;"

# Set up Python environment
echo "Setting up Python environment..."
python -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Create uploads directory
echo "Creating uploads directory..."
mkdir -p uploads

# Prompt for JWT secret key or generate random one
echo "Setting up JWT secret key..."
read -p "Generate random JWT secret key? (Y/n): " GENERATE_SECRET
GENERATE_SECRET=${GENERATE_SECRET:-Y}

if [[ ${GENERATE_SECRET^^} == "Y" ]]; then
    # Generate a random 32-character secret key
    SECRET_KEY=$(openssl rand -hex 32)
    echo "Generated random secret key."
else
    read -s -p "Enter JWT secret key: " SECRET_KEY
    echo
fi

# Prompt for JWT token expiration
read -p "Enter JWT token expiration time in minutes [30]: " TOKEN_EXPIRE
TOKEN_EXPIRE=${TOKEN_EXPIRE:-30}

# Create .env file
echo "Creating .env file..."
cat > .env << EOL
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=$TOKEN_EXPIRE
DATABASE_URL=postgresql+asyncpg://$DB_USER:$DB_PASSWORD@localhost:5432/netxplore
DB_ECHO=False
UPLOAD_FOLDER=./uploads/
DEBUG=False
EOL

# Secure the .env file
chmod 600 .env
echo "Created and secured .env file with 600 permissions (read/write for owner only)."

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

echo
echo "Setup complete!"
echo "To start the server, run: source venv/bin/activate && python main.py run-server"