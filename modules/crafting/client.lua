if not lib then return end

local CraftingBenches = {}
local Items = require 'modules.items.client'
local createBlip = require 'modules.utils.client'.CreateBlip
local Utils = require 'modules.utils.client'
local prompt = {
    options = { icon = 'fa-wrench' },
    message = ('**%s**  \n%s'):format(locale('open_crafting_bench'), locale('interact_prompt', GetControlInstructionalButton(0, 38, true):sub(3)))
}

---@param id number
---@param data table
local function createCraftingBench(id, data)
	CraftingBenches[id] = {}
	local recipes = data.items

	if recipes then
		data.slots = #recipes

		for i = 1, data.slots do
			local recipe = recipes[i]
			local item = Items[recipe.name]

			if item then
				recipe.weight = item.weight
				recipe.slot = i
			else
				warn(('failed to setup crafting recipe (bench: %s, slot: %s) - item "%s" does not exist'):format(id, i, recipe.name))
			end
		end

		local blip = data.blip

		if blip then
			blip.name = blip.name or ('ox_crafting_%s'):format(data.label and id or 0)
			AddTextEntry(blip.name, data.label or locale('crafting_bench'))
		end

		if shared.target then
			data.points = nil
            if data.zones then
    			for i = 1, #data.zones do
    				local zone = data.zones[i]
    				zone.name = ("craftingbench_%s:%s"):format(id, i)
    				zone.id = id
    				zone.index = i
    				zone.options = {
    					{
    						label = zone.label or locale('open_crafting_bench'),
    						canInteract = data.groups and function()
    							return client.hasGroup(data.groups)
    						end or nil,
    						onSelect = function()
    							client.openInventory('crafting', { id = id, index = i })
    						end,
    						distance = zone.distance or 2.0,
    						icon = zone.icon or 'fas fa-wrench',
    					}
    				}

    				exports.ox_target:addBoxZone(zone)

    				if blip then
    					createBlip(blip, zone.coords)
    				end
    			end
            end
		elseif data.points then
			data.zones = nil

			for i = 1, #data.points do
				local coords = data.points[i]

				lib.points.new({
					coords = coords,
					distance = 16,
					benchid = id,
					index = i,
					inv = 'crafting',
                    prompt = prompt,
                    marker = client.craftingmarker,
					nearby = Utils.nearbyMarker
				})

				if blip then
					createBlip(blip, coords)
				end
			end
		end

		CraftingBenches[id] = data
	end
end

for id, data in pairs(lib.load('data.crafting') or {}) do createCraftingBench(data.name or id, data) end

---@param id string Unique bench identifier
---@param data table Bench data with items, label, etc.
local function registerCraftingBench(id, data)
    if not id or not data then return false end
    
    -- Create the bench without points/zones (pcore2 handles interactions)
    data.points = nil
    data.zones = nil
    data.blip = nil -- pcore2 handles blips
    
    createCraftingBench(id, data)
    return true
end

---@param id string Bench identifier to update
---@param data table New bench data
local function updateCraftingBench(id, data)
    if not id or not data then return false end
    
    -- Remove old bench first
    CraftingBenches[id] = nil
    
    -- Create with new data
    data.points = nil
    data.zones = nil
    data.blip = nil
    
    createCraftingBench(id, data)
    return true
end

---@param id string Bench identifier to remove
local function removeCraftingBench(id)
    if not id then return false end
    CraftingBenches[id] = nil
    return true
end

---@param id string Bench identifier
---@return table|nil Bench data
local function getCraftingBench(id)
    return CraftingBenches[id]
end

---@return table All crafting benches
local function getAllCraftingBenches()
    return CraftingBenches
end

exports('registerCraftingBench', registerCraftingBench)
exports('updateCraftingBench', updateCraftingBench)
exports('removeCraftingBench', removeCraftingBench)
exports('getCraftingBench', getCraftingBench)
exports('getAllCraftingBenches', getAllCraftingBenches)

-- Event to sync bench from server
RegisterNetEvent('ox_inventory:registerCraftingBench', function(id, data)
    registerCraftingBench(id, data)
end)

RegisterNetEvent('ox_inventory:updateCraftingBench', function(id, data)
    updateCraftingBench(id, data)
end)

RegisterNetEvent('ox_inventory:removeCraftingBench', function(id)
    removeCraftingBench(id)
end)

return CraftingBenches
