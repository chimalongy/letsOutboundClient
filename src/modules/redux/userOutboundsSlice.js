import { createSlice } from '@reduxjs/toolkit'

const initialData = {
    outbounds: [
        // {   
        //     _id:"{klnskcnkcnbjcdsjknkkls}",
        //     ownerAccount: "me.chimaobi@gmail.com",
        //     emailAddress: "geniusdomainnames1@gmail.com",
        //     password: "xsjhjsdj",
        //     senderName: "Chima Longy",
        //     signature: "Best Regard, \nChima Longy, \nGenuisDomainNames",
        //     dailySendingCapacity: 40,
        //     daysAssigned: []
        // },
        // {   
        //     _id:"{klnskcnkcnbjcnllmdsjknkkls}",
        //     ownerAccount: "me.chimaobi@gmail.com",
        //     emailAddress: "geniusdomainnames2@gmail.com",
        //     password: "xsjhjsdj",
        //     senderName: "Chima Longy",
        //     signature: "Best Regard, \nChima Longy, \nGenuisDomainNames",
        //     dailySendingCapacity: 45,
        //     daysAssigned: []
        // },
        // {   
        //     _id:"{klnskcnkcnbjcdsjknkkklnklls}",
        //     ownerAccount: "me.chimaobi@gmail.com",
        //     emailAddress: "geniusdomainnames3@gmail.com",
        //     password: "xsjhjsdj",
        //     senderName: "Chima Longy",
        //     signature: "Best Regard, \nChima Longy, \nGenuisDomainNames",
        //     dailySendingCapacity: 45,
        //     daysAssigned: []
        // },
        // {   
        //     _id:"{klnskcnkcnbjcdsjknkkls}",
        //     ownerAccount: "me.chimaobi@gmail.com",
        //     emailAddress: "geniusdomainnames1@gmail.com",
        //     password: "xsjhjsdj",
        //     senderName: "Chima Longy",
        //     signature: "Best Regard, \nChima Longy, \nGenuisDomainNames",
        //     dailySendingCapacity: 40,
        //     daysAssigned: []
        // },
        // {   
        //     _id:"{klnskcnkcnbjcnllmdsjknkkls}",
        //     ownerAccount: "me.chimaobi@gmail.com",
        //     emailAddress: "geniusdomainnames2@gmail.com",
        //     password: "xsjhjsdj",
        //     senderName: "Chima Longy",
        //     signature: "Best Regard, \nChima Longy, \nGenuisDomainNames",
        //     dailySendingCapacity: 45,
        //     daysAssigned: []
        // },
        // {   
        //     _id:"{klnskcnkcnbjcdsjknkkklnklls}",
        //     ownerAccount: "me.chimaobi@gmail.com",
        //     emailAddress: "geniusdomainnames3@gmail.com",
        //     password: "xsjhjsdj",
        //     senderName: "Chima Longy",
        //     signature: "Best Regard, \nChima Longy, \nGenuisDomainNames",
        //     dailySendingCapacity: 45,
        //     daysAssigned: []
        // }
        // ,
        // {   
        //     _id:"{klnskcnkcnbjcdsjknkkls}",
        //     ownerAccount: "me.chimaobi@gmail.com",
        //     emailAddress: "geniusdomainnames1@gmail.com",
        //     password: "xsjhjsdj",
        //     senderName: "Chima Longy",
        //     signature: "Best Regard, \nChima Longy, \nGenuisDomainNames",
        //     dailySendingCapacity: 40,
        //     daysAssigned: []
        // },
        // {   
        //     _id:"{klnskcnkcnbjcnllmdsjknkkls}",
        //     ownerAccount: "me.chimaobi@gmail.com",
        //     emailAddress: "geniusdomainnames2@gmail.com",
        //     password: "xsjhjsdj",
        //     senderName: "Chima Longy",
        //     signature: "Best Regard, \nChima Longy, \nGenuisDomainNames",
        //     dailySendingCapacity: 45,
        //     daysAssigned: []
        // },
        // {   
        //     _id:"{klnskcnkcnbjcdsjknkkklnklls}",
        //     ownerAccount: "me.chimaobi@gmail.com",
        //     emailAddress: "geniusdomainnames3@gmail.com",
        //     password: "xsjhjsdj",
        //     senderName: "Chima Longy",
        //     signature: "Best Regard, \nChima Longy, \nGenuisDomainNames",
        //     dailySendingCapacity: 45,
        //     daysAssigned: []
        // }
    ]
}

export const outboundSlice = createSlice({
    name: 'userOutbounds',
    initialState: {
        userOutbounds: initialData
    },
    reducers: {
        setUserOutbounds: (state, action) => {
            state.userOutbounds = action.payload;
        },
        unsetUserOutbounds: (state, action) => {
            state.userOutbounds = initialData;
        },
        addUserOutbound: (state, action) => {
            state.userOutbounds.push(action.payload);
        },

    },

})

export const { setUserOutbounds,  unsetUserOutbounds, addUserOutbound} = outboundSlice.actions;
export default outboundSlice.reducer;