#!/bin/bash

# Create the directory structure
mkdir -p backend/{config,domain/{models,services},application/{dtos,interfaces,services},persistence/{models,repositories},infrastructure/{security,storage},api/routes,migrations/versions}

# Create __init__.py files
find backend -type d -exec touch {}/__init__.py \;

# Create specific files
touch backend/config/settings.py

# Domain layer
touch backend/domain/models/{user,research,network}.py
touch backend/domain/services/{auth_service,network_analysis_service}.py

# Application layer
touch backend/application/dtos/{user_dto,research_dto,network_dto}.py
touch backend/application/interfaces/{user_repository,research_repository,file_repository}.py
touch backend/application/services/{au#!/bin/bash

# Create the directory structure
mkdir -p backend/{config,domain/{entities,repositories,exceptions},application/{services,dtos,interfaces},infrastructure/{persistence/{models,repositories},security,storage},api/routes,alembic/versions}

# Create __init__.py files
find backend -type d -exec touch {}/__init__.py \;

# Create specific files
touch backend/config/settings.py

# Domain layer
touch backend/domain/entities/{user,research,network}.py
touch backend/domain/repositories/{user_repository,research_repository,file_repository}.py
touch backend/domain/exceptions/domain_exceptions.py

# Application layer
touch backend/application/dtos/{user_dto,research_dto,network_dto}.py
touch backend/application/services/{auth_service,user_service,research_service,file_service,network_service}.py
touch backend/application/interfaces/{security_service,storage_service}.py

# Infrastructure layer
touch backend/infrastructure/persistence/database.py
touch backend/infrastructure/persistence/models/{user,research,network}.py
touch backend/infrastructure/persistence/repositories/{user_repository,research_repository,file_repository}.py
touch backend/infrastructure/security/{password_service,jwt_service}.py
touch backend/infrastructure/storage/file_storage.py

# API layer
touch backend/api/{dependencies,error_handlers}.py
touch backend/api/routes/{auth,users,files,research,network}.py

# Root files
touch backend/main.py
touch backend/requirements.txt
touch backend/alembic.ini