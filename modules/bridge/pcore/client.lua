if not lib.checkDependency('pcore2', '0.0.1', true) then return end

RegisterNetEvent('pcore:playerLogout', client.onLogout)

RegisterNetEvent('pcore:setGroup', function(groupType, groupId, level)
    -- Convert pcore2 group structure to ox_inventory format
    -- pcore2 uses {groupType: {groupId: {level, ...}}}
    -- ox_inventory expects {groupName: grade}
    if not PlayerData.groups then PlayerData.groups = {} end
    
    if groupType and groupId and level then
        local groupName = ('%s_%s'):format(groupType, groupId)
        PlayerData.groups[groupName] = level
    elseif groupType and groupId and not level then
        local groupName = ('%s_%s'):format(groupType, groupId)
        PlayerData.groups[groupName] = nil
    end
    
    OnPlayerData('groups')
end)

---@diagnostic disable-next-line: duplicate-set-field
function client.setPlayerStatus(values)
    -- TODO: Implement
end

