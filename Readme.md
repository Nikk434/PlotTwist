# PlotTwist

PlotTwist is a real-time, collaborative storytelling platform where users compete in writing challenges within timed matches. Each match includes a theme and participants craft short stories, which are then rated by peers. The platform aims to make writing interactive, competitive, and fun.

# Project Overview
PlotTwist transforms solo writing into a social challenge. Players join or host story matches, write within a given time frame, and rate each other’s submissions. The platform handles real-time synchronization, secure authentication, and match management — offering a smooth multiplayer storytelling experience.

## Key Features

-   **JWT Authentication**: Secure login, registration, and session handling with access/refresh tokens.
    
-   **Timed Matches**: Host and join matches with countdown timers.
    
-   **Collaborative Writing Editor**: Clean, responsive text editor with auto-save and story submission.
    
-   **Peer Ratings**: Participants can rate others’ stories with stars and feedback.
    
-   **Real-Time Match Logic**: Status transitions from _waiting → active → complete_ based on timers and participation.
    
-   **Role-Based Access**: Only participants and hosts can access match editors or submit stories.
    
-   **Fully Integrated Frontend + Backend**: Next.js frontend with FastAPI backend connected through secure cookies.
## Tech Stack

**Frontend:**

-   Next.js (App Router)
    
-   React
    
-   Tailwind CSS / ShadCN UI
    

**Backend:**

-   FastAPI (Python)
    
-   JWT Authentication
    
-   Pydantic Models
    

**Database:**

-   MongoDB (Async I/O with Motor)
    

**Deployment:**

-   Frontend: Vercel
    
-   Backend: Render

## Future Enhancements

-   Live match countdown and synchronized timers.
    
-   Push notifications for match start and result updates.
    
-   AI-powered story summaries or suggestions.
    
-   Leaderboards and player stats tracking.
    
-   In-match chat system for participants.
