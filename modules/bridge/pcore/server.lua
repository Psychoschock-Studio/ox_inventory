if not lib.checkDependency('pcore', '0.0.1', true) then return end

local Inventory = require 'modules.inventory.server'

function server.playerDropped(source)
	local inv = Inventory(source) --[[@as OxInventory]]

	if inv?.player then
		inv:closeInventory()
		Inventory.Remove(inv)
	end
end

AddEventHandler("pcore:server:OnCharacterChanged", server.playerDropped)

local function reorderGroups(groups)
    groups = groups or {}
    for group, info in pairs(groups) do
        groups[group] = info.rank
    end
    return groups
end

local function setCharacterInventory(character)
    character.source = character.charInfo.source
    character.identifier = character.charId
    character.name = ("%s %s"):format(character.charInfo.data.firstName, character.charInfo.data.lastName)
    character.dateofbirth = character.charInfo.data.birthday
    character.sex = character.charInfo.data.sex
    character.groups = {} -- TODO
    server.setPlayerInventory(character, false)
    -- Inventory.SetItem(character.source, "money", 999999) -- TODO
end

SetTimeout(500, function()
    for _, character in pairs(exports.pcore:getPlayers()) do
        setCharacterInventory(character)
    end
end)

AddEventHandler("pcore:server:OnCharacterSpawned", setCharacterInventory)

-- TODO: Update groups on player change

---@diagnostic disable-next-line: duplicate-set-field
function server.setPlayerData(player)
    return {
        source = player.source,
        identifier = player.id,
        name = ("%s %s"):format(player.firstName, player.lastName),
        groups = player.groups,
        sex = player.gender,
        dateofbirth = player.dob
    }
end

---@diagnostic disable-next-line: duplicate-set-field
function server.hasLicense(inv, license)
    return true -- TODO
end

---@diagnostic disable-next-line: duplicate-set-field
function server.buyLicense(inv, license)
	if server.hasLicense(inv, license.name) then
		return false, "already_have"
	elseif Inventory.GetItemCount(inv, 'money') < license.price then
		return false, "can_not_afford"
	end

	Inventory.RemoveItem(inv, "money", license.price)

	return true, "have_purchased" -- TODO
end

---@diagnostic disable-next-line: duplicate-set-field
function server.isPlayerBoss(playerId, group)
    return true -- TODO
end

---@param entityId number
---@return number | string
---@diagnostic disable-next-line: duplicate-set-field
function server.getOwnedVehicleId(entityId)
    return entityId -- TODO
end
