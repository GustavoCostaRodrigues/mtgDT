// web/src/submodules/auth/authStorage.ts

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan?: string;
  totalCards?: number;
  totalDecks?: number;
  totalWishlist?: number;
  collectionValue?: string;
  joinedAt?: string;
}

export const DEFAULT_USER: UserProfile = {
  id: '',
  name: 'Jogador',
  email: '',
  avatarUrl: '/mascot.png',
  plan: 'Gratuito',
  totalCards: 0,
  totalDecks: 0,
  totalWishlist: 0,
  collectionValue: 'R$ 0,00',
  joinedAt: '',
};

const USER_STORAGE_KEY = 'spellbinder_user';

export function getStoredUser(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.name || parsed.email)) {
        return {
          id: parsed.id || DEFAULT_USER.id,
          name: parsed.name || (parsed.email ? parsed.email.split('@')[0] : DEFAULT_USER.name),
          email: parsed.email || DEFAULT_USER.email,
          avatarUrl: parsed.avatarUrl || DEFAULT_USER.avatarUrl,
          plan: parsed.plan || DEFAULT_USER.plan,
          totalCards: typeof parsed.totalCards === 'number' ? parsed.totalCards : DEFAULT_USER.totalCards,
          totalDecks: typeof parsed.totalDecks === 'number' ? parsed.totalDecks : DEFAULT_USER.totalDecks,
          totalWishlist: typeof parsed.totalWishlist === 'number' ? parsed.totalWishlist : DEFAULT_USER.totalWishlist,
          collectionValue: parsed.collectionValue || DEFAULT_USER.collectionValue,
          joinedAt: parsed.joinedAt || DEFAULT_USER.joinedAt,
        };
      }
    }

    const savedEmail = localStorage.getItem('saved_email');
    if (savedEmail) {
      const inferredName = savedEmail.split('@')[0];
      const formattedName = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);
      return {
        ...DEFAULT_USER,
        email: savedEmail,
        name: formattedName,
      };
    }
  } catch (error) {
    console.error('Erro ao ler usuário salvo:', error);
  }
  return DEFAULT_USER;
}

export function setStoredUser(userUpdate: Partial<UserProfile>): UserProfile {
  try {
    const current = getStoredUser();
    const updated: UserProfile = {
      ...current,
      ...userUpdate,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    if (updated.email) {
      localStorage.setItem('saved_email', updated.email);
    }
    window.dispatchEvent(new CustomEvent('spellbinder-user-change', { detail: updated }));
    return updated;
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    return DEFAULT_USER;
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem('spellbinder_token');
    window.dispatchEvent(new CustomEvent('spellbinder-user-change', { detail: DEFAULT_USER }));
  } catch (error) {
    console.error('Erro ao limpar usuário:', error);
  }
}
