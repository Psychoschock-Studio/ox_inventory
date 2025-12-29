return {
    categories = {
        {
            title = 'Legal Actions',
            commands = {
                { id = 'calllawyer', description = 'Call a lawyer for legal assistance', usage = '/calllawyer [reason]' },
                { id = 'payfine', description = 'Pay an outstanding fine to the authorities', usage = '/payfine [amount]' },
                { id = 'showid', description = 'Show your ID card to nearby players', usage = '/showid' },
            }
        },
        {
            title = 'Civilian Life',
            commands = {
                { id = 'sit', description = 'Sit on the nearest seat or bench', usage = '/sit' },
                { id = 'knock', description = 'Knock on the nearest door', usage = '/knock' },
                { id = 'wave', description = 'Wave to people around you', usage = '/wave' },
            }
        },
        {
            title = 'Emergency Services',
            commands = {
                { id = 'callmedic', description = 'Request medical assistance', usage = '/callmedic' },
                { id = 'emoteinjured', description = 'Roleplay as if you are injured', usage = '/emoteinjured' },
                { id = 'panic', description = 'Send a panic alert to emergency services', usage = '/panic' },
            }
        },
        {
            title = 'Criminal Activity',
            commands = {
                { id = 'lockpick', description = 'Attempt to lockpick a vehicle or door', usage = '/lockpick' },
                { id = 'mask', description = 'Put on or take off a mask', usage = '/mask' },
                { id = 'stealth', description = 'Move in a stealthy manner', usage = '/stealth' },
            }
        },
        {
            title = 'Business & Jobs',
            commands = {
                { id = 'jobstatus', description = 'Check your current job status', usage = '/jobstatus' },
                { id = 'deliver', description = 'Deliver goods to specified location', usage = '/deliver [location]' },
                { id = 'bill', description = 'Send a bill to another player', usage = '/bill [id] [amount]' },
            }
        },
        {
            title = 'Social',
            commands = {
                { id = 'shout', description = 'Shout a message to players around you', usage = '/shout [message]' },
                { id = 'whisper', description = 'Whisper to a nearby player', usage = '/whisper [message]' },
                { id = 'describe', description = 'Describe your character’s appearance/action', usage = '/describe [text]' },
            }
        },
    }
}
