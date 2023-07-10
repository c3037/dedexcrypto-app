import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
    key: 'recoil-persist',
    storage: localStorage,
    converter: JSON,
});

export const contractAddress = atom<string>({
    key: 'contact_address',
    default: '',
    effects_UNSTABLE: [persistAtom],
});
