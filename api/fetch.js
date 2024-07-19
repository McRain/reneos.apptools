import GraphQLClient from "@reneos/gqlc"

export default config => {
	const options = {
		method: "POST",
		credentials: "include",
		url: "localhost",
		...config,
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			...config.headers
		}
	}
	return async d => {
		try {
			const data = JSON.stringify(d)
			options.body = data
			const response = await fetch(options.url,options)
			const {data:value,error:err} = await response.json()
			if(err)
				throw new GraphQLClient.GraphError(err)
			return value
		} catch (e) {
			console.warn(e)
			throw e
		}
	}
}