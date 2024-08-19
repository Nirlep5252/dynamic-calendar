# Dynamic Calendar

## Features

1. Dynamic Calendar Views
   - Day View
   - Week View
   - Month View
   - Agenda View
2. Event Scheduling
   - Create events with title, description, start and end time
   - Events can be dragged and resized
   - Events can have `all_day` flag, which will make them span the whole day
   - Click on a day to create a new event
   - Click on an event to edit or delete it
3. Event Display
   - Events are displayed in the calendar
   - Events are displayed in a list in the Agenda View
   - Overlapping events are displayed in a stack
4. Backend Integration
   - Events are stored in a database
   - FastAPI + MongoDB backend
5. Frontend
   - React (ViteJS) frontend
   - ShadcnUI components

## Steps to run

First of all, clone the repository:

```bash
git clone https://github.com/nirlep5252/dynamic-calendar
cd dynamic-calendar
```

Make sure you have MongoDB installed and running on the default port.

### Backend

1. Change directory to the backend folder:

   ```bash
   cd backend
   ```

2. Create virtual environment (optional)

   ```bash
   python3 -m venv venv

   # Linux / MacOS
   source venv/bin/activate

   # Windows
   ./venv/Scripts/Activate.ps1
   ```

3. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file:

   ```bash
   cp .example.env .env
   ```

5. Start the backend server:

   ```bash
   fastapi dev
   ```

### Frontend

1. Change directory to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install the dependencies:

   ```bash
    npm install # or bun install
   ```

3. Start the frontend server:

   ```bash
    npm run dev # or bun dev
   ```
