type QueryResult<T = unknown> = { data: T | null; error: Error | null };

class MockQueryBuilder<T = unknown> {
  private readonly result: QueryResult<T>;

  constructor(result: QueryResult<T> = { data: null, error: null }) {
    this.result = result;
  }

  select(): this {
    return this;
  }

  eq(): this {
    return this;
  }

  order(): this {
    return this;
  }

  limit(): this {
    return this;
  }

  range(): this {
    return this;
  }

  maybeSingle(): Promise<QueryResult<T>> {
    return Promise.resolve(this.result);
  }

  single(): Promise<QueryResult<T>> {
    return Promise.resolve(this.result);
  }

  then<TResult1 = QueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.result).then(onfulfilled, onrejected);
  }
}

export function createMockSupabaseClient() {
  // Loudly visible in the browser console so a missing env var in production
  // is never mistaken for "the app works but has no data".
  if (typeof console !== 'undefined') {
    console.warn(
      '[Arewa Stay] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set. ' +
      'Falling back to the mock Supabase client: no data will load or persist.'
    );
  }
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: () => new MockQueryBuilder(),
    channel: () => ({
      on: () => ({ subscribe: async () => {} }),
      subscribe: async () => {},
      unsubscribe: async () => {},
    }),
    removeChannel: () => {},
  } as any;
}
