import GraphQLClient from "@reneos/gqlc"

import * as Gateways from './gateways.js'

class Api {

	static get Client(){
		return GraphQLClient
	}

	static get Gateways(){
		return Gateways
	}

	static AddGateway(key,handler){
		Gateways[key] = handler
	}

	static RemoveGateway(key){
		delete Gateways[key]
	}

	static Init(gateway,config={},stored){
		const gw = Gateways[gateway]
		GraphQLClient.Send = gw(config)//return function
		if (stored)
			GraphQLClient.Add(stored)
		return _proxy
	}
}
const _proxy = new Proxy(Api, {
	get(target, prop) {
		if (prop in target)
			return target[prop]
		return GraphQLClient[prop]
	}
})

export default _proxy