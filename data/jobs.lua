return {
    joinButtonLabel = 'Join the activity',
    categories = {
        {
            title = 'Emergency Services',
            jobs = {
                {
                    id = 'police',
                    name = 'Police Officer',
                    description = 'Protect and serve the community',
                    image = 'https://i.imgur.com/example1.png',
                    event = 'jobs:joinPolice',
                    args = { rank = 'recruit' }
                },
                {
                    id = 'ems',
                    name = 'Paramedic',
                    description = 'Save lives and provide medical assistance',
                    image = 'https://i.imgur.com/example2.png',
                    eventServer = 'jobs:joinEMS',
                    args = { department = 'hospital' }
                }
            }
        },
        {
            title = 'Civilian Jobs',
            jobs = {
                {
                    id = 'mechanic',
                    name = 'Mechanic',
                    description = 'Repair and customize vehicles',
                    event = 'jobs:joinMechanic',
                    args = {}
                }
            }
        }
    }
}

