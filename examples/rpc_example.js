const protobuf = require('protobufjs');


function callback_example() {
    protobuf.load('./helloworld.proto', async function (err, root) {
        if (err) {
            throw err;
        }

        let Greeter = root.lookupService('helloworld.Greeter');
        let HelloRequest = root.lookupType('helloworld.HelloRequest');
        let HelloReply = root.lookup('HelloReply', true);

        function rpcImpl(method, requestData, callback) {
            let message = HelloRequest.decode(requestData);
            message = HelloRequest.toObject(message);
            console.log(message);
            let err = HelloRequest.verify(message);
            if (err) {
                console.error(err);
            }

            const data = {
                message: 'hello ' + message.name,
                id: message.id,
                field: 6
            };
            let responseData = HelloReply.create(data);
            callback(null, HelloReply.encode(responseData).finish());
        }

        const greeter = Greeter.create(rpcImpl);

        greeter.sayHello({name: 'callback', id: [1, 2]}, function (err, response) {
            console.log('Callback Greeting:', response);
        });

    });
}


function promise_example() {
    void async function () {
        try {
            const root = await protobuf.load('./helloworld.proto');
            let Greeter = root.lookupService('Greeter');
            const greeter = Greeter.create(rpcImpl);
            let response = await greeter.sayHello({name: 'promise', id: null});
            console.log('Promise Greeting:', response);
        } catch (err) {
            console.error(err);
        }
    }();


    function rpcImpl(method, requestData, callback) {
        const root = method.root;
        const requestType = root.lookup(method.requestType);
        const responseType = root.lookup(method.responseType);

        let message = requestType.decode(requestData);
        message = requestType.toObject(message);
        console.log(message);
        let err = requestType.verify(requestData);
        if (err) {
            console.error(err);
        }

        const data = {
            message: 'hello ' + message.name,
            id: message.id,
            field: 6
        };
        let responseData = responseType.create(data);
        callback(null, responseType.encode(responseData).finish());
    }
}



function staic_example() {
    const helloworld_proto = require('./helloworld_proto');

    void async function () {
        try {
            const greeter = helloworld_proto.helloworld.Greeter.create(rpcImpl);
            let response = await greeter.sayHello({name: 'staic', id: [2,3,3]});
            console.log('Static Greeting:', helloworld_proto.helloworld.HelloReply.toObject(response));
            console.log(response);
            console.log(helloworld_proto.helloworld.HelloReply.toObject(response));
        } catch (err) {
            console.error(err);
        }
    }();

    function rpcImpl(method, requestData, callback) {
        callback(null, requestData);
    }
}


staic_example();