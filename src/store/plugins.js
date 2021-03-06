
import { KEYS, state } from '@/store/state.js'

// called when the store is initialize
const localStoreSync = store => {
    const local_items = {
        'contacts': KEYS.CONTACTS,
        'conversations': KEYS.CONVERSATIONS,
        'clearContacts': KEYS.CONTACTS,
        'account_id': KEYS.ACCOUNT_ID,
        'hash': KEYS.HASH,
        'salt': KEYS.SALT,
        'theme_base': KEYS.THEME.BASE,
        'theme_global_default': KEYS.THEME.GLOBAL_DEFAULT,
        'theme_global_dark': KEYS.THEME.GLOBAL_DARK,
        'theme_global_accent': KEYS.THEME.GLOBAL_ACCENT,
        'theme_use_global': KEYS.THEME.USE_GLOBAL,
        'notifications': KEYS.NOTIFICATIONS,
        'enter_to_send': KEYS.ENTER_TO_SEND,
    }

    // called after every mutation.
    store.subscribe((mutation, state) => {
        // Only save if in local_items array
        if (!Object.keys(local_items).contains(mutation.type))
            return;

        let key = local_items[mutation.type]
        let value = JSON.stringify(state[mutation.type])

        window.localStorage.setItem(key, value)
    })
}


export default [ localStoreSync ];
