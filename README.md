# Recipe Backend API

A RESTful API for managing recipes with categories and ordering capabilities.

<img width="490" alt="Screenshot 2025-03-10 at 1 20 26 AM" src="https://github.com/user-attachments/assets/dbdedf5d-13ff-45b1-b3fb-6ba59f65c1d9" />


## Base URL

```
http://localhost:3000
```

## API Endpoints

### Get All Recipes

```http
GET /recipes
```

- Returns all recipes sorted by category and order
- Optional query parameter: `category` to filter recipes by category
- Response: Array of recipe objects

### Get Categories

```http
GET /categories
```

- Returns a list of unique categories from all recipes
- Response: Array of category strings

### Create New Recipe

```http
POST /recipes
```

- Creates a new recipe
- Request Body:
  ```json
  {
    "title": "string",
    "ingredients": ["string"],
    "instructions": "string",
    "category": "string",
    "order": "number" (optional)
  }
  ```
- If order is not provided, it will be automatically set to the last position in its category
- Response: Created recipe object

### Update Recipe

```http
PUT /recipes/:id
```

- Updates an existing recipe by ID
- Request Body: Any recipe fields to update
  ```json
  {
    "title": "string",
    "ingredients": ["string"],
    "instructions": "string",
    "category": "string",
    "order": "number"
  }
  ```
- Response: Updated recipe object

## Data Model

### Recipe Schema

```typescript
{
  title: string,       // required
  ingredients: string[], // required
  instructions: string,  // required
  category: string,     // required
  order: number        // default: 0
}
```

## Error Responses

- `400 Bad Request`: Missing required fields
- `404 Not Found`: Recipe not found
- `500 Internal Server Error`: Server-side errors

## Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
