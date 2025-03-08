if not lib.checkDependency('pcore', '0.0.1', true) then return end

RegisterNetEvent("pcore:client:OnCharacterChanged", client.onLogout)

local function reorderGroups(groups)
    if not groups or not groups.job then return {} end
    for groupId, data in pairs(groups.job) do
        local groupInfo = exports.pcore:getGroupData("job", groupId)
        if groupInfo then
            groups[groupInfo.name] = data.level
        end
    end
    return groups
end

SetTimeout(500, function()
    local player = exports.pcore:getLocalPlayerData()
    if not player then return end
    client.setPlayerData("groups", reorderGroups(player.groups))
end)

RegisterNetEvent("pcore:client:OnCharacterSpawned", function()
    local player = exports.pcore:getLocalPlayerData()
    if not player then return end
    client.setPlayerData("groups", reorderGroups(player.groups))
end)


---@diagnostic disable-next-line: duplicate-set-field
-- function client.setPlayerStatus(values)
--     if GetResourceState("ND_Status") ~= "started" then return end

--     local status = exports["ND_Status"]

--     for name, value in pairs(values) do

--         if value > 100 or value < -100 then
--             value = value * 0.0001
--         end

--         status:changeStatus(name, value)
--     end
-- end
