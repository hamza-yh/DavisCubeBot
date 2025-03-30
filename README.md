# Davis Cube Club Discord Bot

## Overview

This is a Discord bot for the Davis Cube Club, built using the **TypeScript**, **Node.js** and the **discord.js** library. The bot provides ease of life features useful for all cubers, such as tracking upcoming competitions and registration dealines, club rankings and history. Anyone is welcome to contribute to the project!. Feel free to join the [Davis Cube Club Discord](https://linktr.ee/daviscubeclub) if you have any questions or friend 'hamzayh' on discord.

## Features & Commands

Below is an outline of the commands and functionalities that this bot will support. More implementation details can be discussed if someone chooses to work on a specific feature by opening an issue.

### Completed Commands

#### `/registeredcomps <WCA ID>`

-   Returns a list of competitions the person is registered for.
-   Future feature: Allow searching by name or selecting a Discord username for easier access.

#### `/upcomingcomps`

-   Displays all upcoming competitions around Davis.
-   Provides registration deadlines, events, and a list of currently signed-up competitors.
-   Need to add pagination to display more than 25 competitions are displayed.

#### `/scramble`

-   Generates a random scramble for official WCA events.

### Unimplemented Commands

#### `/ranking <event>`

-   Provides the ranking of UC Davis Cube Club members for a given event.
-   Includes all current and past students who were ever in the club.

#### `/currentranking <event>`

-   Functions the same as `/ranking`, but only includes current students.

#### `/records`

-   Displays the history of club records.
-   Includes student results from all time.

#### `/clubrecords`

-   Similar to `/records`, but only considers results acheived from students while they attended UC Davis.

#### `/compresults <competition>`

-   Shows the top three Davis students' results for each event in a given competition.

### Additional Functionalities (Not Yet Implemented)

#### Personal Record Tracker

-   Sends a congratulatory message when a club member achieves a new personal record at a competition.

#### Podium Tracker

-   Sends a notification when a club member earns a podium placement at a competition.

#### Competition Reminders

-   Notifies the server when:
    -   A new competition is announced.
    -   Registration opens or closes.
    -   Results are officially posted.

## Technical Details

The bot interacts with various data sources to receive information:

-   [**WCA API (api/v0)**](): Utilized by the WCA website. Provides accurate and updated data as they are uploaded to the website. However, it has limited documentation and can be difficult to use.
-   [**WCIF Competition Data**](https://github.com/thewca/wcif/tree/master?tab=readme-ov-file): Used to retreive live data on all compeition data as they are updated throughout a competition
-   [**Unofficial WCA API**](https://wca-rest-api.robiningelbrecht.be/): Recommended by WCA for third-party use. It provides fast and reliable acess to data in the [WCA Results Export](https://www.worldcubeassociation.org/export/results). Results are static since they are updated once a day.
-   [**WCA Live API**](https://github.com/thewca/wca-live): The WCA Live website access to real-time day of competition results as they are updated throughout the day through a GraphQL API. I would recommend trying to use WCIF (the information is the same).

## Setup & Installation

To set up and run the bot locally:

1. **Fork the Repository**

    - Click the **Fork** button on GitHub to create your own copy of the repository.

2. **Clone the Repository**

    - Create a local folder where you want to store the project.
    - Open a terminal and run:
        ```sh
        git clone <your-forked-repo-url>
        ```
    - Navigate into the cloned folder:
        ```sh
        cd <project-folder>
        ```

3. **Install Dependencies**

    ```sh
    npm install
    ```

4. **Set Up Credentials**

    - Create a file called `bot-creds.json` in the outermost project folder.
    - Create a application in the discord developer portal and make a new bot. You should receive a bot token. Detailed instruction can be [found here](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
    - Store your bot token in this file following this format:
        ```json
        {
            "token": "your-bot-token-here"
        }
        ```

5. **Run the Bot**

    - **On Mac/Linux** (may not work on all systems):
        ```
        npm run dev
        ```
    - **On Windows (using Windows Terminal or Command Prompt):**
        ```
        npm run win
        ```

6. **Verify the Bot is Running**
    - If the setup is successful, you should see the message:
    ```
    Successfully reloaded # application (/) commands.
    Logged in as davis cube bot!
    ```
