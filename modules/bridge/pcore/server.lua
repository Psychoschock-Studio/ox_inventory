if not lib.checkDependency('pcore2', '0.0.1', true) then return end

local Inventory = require 'modules.inventory.server'

local pcore = exports.pcore2
if not pcore then
    error('[ox_inventory] pcore bridge: Failed to get pcore2 exports. Make sure pcore2 is started before ox_inventory.')
end

AddEventHandler('pcore:playerLogout', server.playerDropped)

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName == 'pcore2' then
        local players = GetPlayers()
        for _, playerId in ipairs(players) do
            local intSource = tonumber(playerId)
            if intSource then
                server.playerDropped(intSource)
            end
        end
    end
end)

local function setCharacterInventory(source)
    if not source then return end
    local intSource = tonumber(source)
    
    if not pcore then return end
    
    local playerData = exports.pcore2:GetPlayerData(intSource)
    if not playerData then return end
    
    if not playerData.charId then return end
    
    local charInfo = playerData.charInfo and playerData.charInfo.data or {}
    local firstName = charInfo.firstName or ''
    local lastName = charInfo.lastName or ''
    local fullName = ('%s %s'):format(firstName, lastName)
    if fullName == ' ' or fullName == '' then
        fullName = GetPlayerName(intSource)
    end
    
    local player = {
        source = intSource,
        identifier = playerData.charId,
        name = fullName,
        groups = {},
        sex = charInfo.sex or nil,
        dateofbirth = charInfo.birthday or nil,
    }
    
    if playerData.groups then
        for groupType, groupData in pairs(playerData.groups) do
            if groupData then
                for groupId, groupInfo in pairs(groupData) do
                    if groupInfo and groupInfo.level then
                        local groupName = ('%s_%s'):format(groupType, groupId)
                        player.groups[groupName] = groupInfo.level or 0
                    end
                end
            end
        end
    end
    
    server.setPlayerInventory(player)
end

SetTimeout(500, function()
    local players = GetPlayers()
    for _, playerId in ipairs(players) do
        local source = tonumber(playerId)
        if source then
            setCharacterInventory(source)
        end
    end
end)

AddEventHandler('pcore:server:OnCharacterLoaded', function(source)
    if not source then return end
    local intSource = tonumber(source)
end)

AddEventHandler('pcore:server:OnCharacterSettled', function(source)
    if not source then return end
    local intSource = tonumber(source)
    
    Wait(500)
    
    local attempts = 0
    local maxAttempts = 15
    
    while attempts < maxAttempts do
        local playerData = exports.pcore2:GetPlayerData(intSource)
        if playerData and playerData.charId then
            setCharacterInventory(intSource)
            return
        end
        attempts = attempts + 1
        Wait(300)
    end
end)

AddEventHandler('pcore:setGroup', function(source, groupType, groupId, level)
    local intSource = tonumber(source)
    local inventory = Inventory(intSource)
    
    if not inventory then return end
    
    if groupType and groupId and level then
        local groupName = ('%s_%s'):format(groupType, groupId)
        inventory.player.groups[groupName] = level
    elseif groupType and groupId and not level then
        local groupName = ('%s_%s'):format(groupType, groupId)
        inventory.player.groups[groupName] = nil
    end
end)

---@diagnostic disable-next-line: duplicate-set-field
function server.setPlayerData(player)
    local intSource = tonumber(player.source)
    
    local playerData = exports.pcore2:GetPlayerData(intSource)
    
    if not playerData then 
        return {
            source = intSource,
            name = player?.name or GetPlayerName(intSource),
            groups = player?.groups or {},
            sex = player?.sex,
            dateofbirth = player?.dateofbirth,
        }
    end
    
    local groups = {}
    
    if playerData.groups then
        for groupType, groupData in pairs(playerData.groups) do
            if groupData then
                for groupId, groupInfo in pairs(groupData) do
                    if groupInfo and groupInfo.level then
                        local groupName = ('%s_%s'):format(groupType, groupId)
                        groups[groupName] = groupInfo.level or 0
                    end
                end
            end
        end
    end
    
    local charInfo = playerData.charInfo or {}
    local firstName = charInfo.firstName or ''
    local lastName = charInfo.lastName or ''
    local name = ('%s %s'):format(firstName, lastName)
    if name == ' ' or name == '' then
        name = player?.name or GetPlayerName(intSource)
    end
    
    return {
        source = intSource,
        name = name,
        groups = groups,
        sex = charInfo.sex or charInfo.gender or player?.sex,
        dateofbirth = charInfo.birthday or charInfo.birthDate or player?.dateofbirth,
    }
end

---@diagnostic disable-next-line: duplicate-set-field
function server.hasLicense(inv, name)
    return false
end

---@diagnostic disable-next-line: duplicate-set-field
function server.buyLicense(inv, license)
    return false, 'not_supported'
end

---@diagnostic disable-next-line: duplicate-set-field
function server.isPlayerBoss(playerId, group, grade)
    local intPlayerId = tonumber(playerId)
    
    local groupType, groupId = group:match('^(%w+)_(%w+)$')
    if not groupType or not groupId then return false end
    
    local playerData = exports.pcore2:GetPlayerData(intPlayerId)
    if not playerData or not playerData.groups then return false end
    
    local playerGroup = playerData.groups[groupType] and playerData.groups[groupType][groupId]
    if not playerGroup then return false end
    
    local groupData = exports.pcore2:GetGroupData(groupType, groupId)
    if not groupData then return false end
    
    local adminGrade = groupData.data and groupData.data.adminGrade or 999
    return playerGroup.level and playerGroup.level >= adminGrade
end

---@param entityId number
---@return number | string
---@diagnostic disable-next-line: duplicate-set-field
function server.getOwnedVehicleId(entityId)
    return nil
end

