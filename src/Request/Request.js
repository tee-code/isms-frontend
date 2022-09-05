export default class Request {
    //constructor
    constructor(url) {
        this.url = `http://localhost:81/inventory-app/apis/${url}`

    }

    post = (bodyMessage) => {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest()
            request.open("POST", this.url, true)

            request.addEventListener("readystatechange", (event) => {
                if (request.status === 200 && request.readyState === 4) {
                    resolve(request.responseText)
                }
            })
            request.onerror = (error) => {
                reject({
                    status: request.status,
                    statusText: request.statusText,
                    error: error
                })
            }
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
            request.send(bodyMessage)
        })
    }

    get = (bodyMessage) => {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest()
            const url = `${this.url}?${bodyMessage}`
            request.open("GET", url, true)

            request.addEventListener("readystatechange", (event) => {
                if (request.status === 200 && request.readyState === 4) {
                    resolve(request.responseText)
                }
            })
            request.onerror = (error) => {
                reject({
                    status: request.status,
                    statusText: request.statusText,
                    error: error
                })
            }
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
            request.send()
        })
    }
}