local ThrownWeapons = {}
local pickupThreadRunning = false

local function hasThrownWeapons()
	for _ in pairs(ThrownWeapons) do return true end
	return false
end

local function runPickupLoop()
	while hasThrownWeapons() do
		local wait = 1000
		local ped = cache.ped
		local nearWeapon = false
		if not IsPlayerDead(ped) and not IsPedInAnyVehicle(ped, true) then
			for k, v in pairs(ThrownWeapons) do
				if v and v.net_id and NetworkDoesNetworkIdExist(v.net_id) then
					local entity = NetToObj(v.net_id)
					if entity and DoesEntityExist(entity) then
						local coords = GetEntityCoords(entity)
						local dist = #(GetEntityCoords(ped) - coords)
						if dist < 5.0 then
							wait = 0
							if dist < 1.25 then
								nearWeapon = true
								lib.showTextUI(locale('pickup_weapon') or '[E] Pick up weapon')
								if IsControlJustPressed(1, 51) then
									lib.hideTextUI()
									ClearPedTasksImmediately(ped)
									FreezeEntityPosition(ped, true)
									RequestAnimDict('pickup_object')
									while not HasAnimDictLoaded('pickup_object') do Wait(0) end
									TaskPlayAnim(ped, 'pickup_object', 'pickup_low', -8.0, 8.0, -1, 49, 1.0)
									Wait(800)
									TriggerServerEvent('ox_inventory:pickupWeapon', k)
									Wait(800)
									ClearPedTasks(ped)
									FreezeEntityPosition(ped, false)
								end
								break
							end
						end
					end
				end
			end
		end
		if not nearWeapon then
			lib.hideTextUI()
		end
		Wait(wait)
	end
	pickupThreadRunning = false
end

RegisterNetEvent('ox_inventory:setThrownWeaponData', function(weaponID, data)
	ThrownWeapons[weaponID] = data
	if data and not pickupThreadRunning then
		pickupThreadRunning = true
		CreateThread(runPickupLoop)
	end
end)
