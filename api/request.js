export default config=>{
	const options = {
		method: "POST",
		path:"/",
		port:80,
		hostname:'localhost',		
		...config,
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			...config.headers
		}
	}
	return d=>{
		const data = JSON.stringify(d)
		return new Promise((resolve, reject) => {
			const req = http.request({
				...options,
				headers:{
					...options.headers,
					'Content-Length': data.length,
				}
			}, res => {
				let result = ""
				res.setEncoding('utf8');
				res.on('data', chunk => result += chunk);
				res.on('end', () => {
					let rs
					try {
						rs = JSON.parse(result)
					} catch (error) {
						return reject(error)
					}
					resolve(rs.data)
				});
				res.on("error", (e) => {
					console.logs(r.message)
				})
			});
			req.on('error', (e) => {
				reject(e)
			});
			req.write(data);
			req.end();
		})
	}
}