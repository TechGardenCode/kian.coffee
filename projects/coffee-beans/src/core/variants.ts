/* =====================================================================
   defineVariants() — CVA-lite, framework-agnostic, zero deps.
   Maps a {base, variants, defaultVariants, compoundVariants} spec
   to a function that returns a class string. Returned value is
   purely string class names; no DOM, no styles, no framework.
   ===================================================================== */

type VariantMap = Record<string, Record<string, string>>;

type VariantProps<V extends VariantMap> = {
  [K in keyof V]?: keyof V[K] & string;
};

type CompoundVariant<V extends VariantMap> = VariantProps<V> & { class: string };

export interface VariantConfig<V extends VariantMap> {
  base?: string;
  variants: V;
  defaultVariants?: VariantProps<V>;
  compoundVariants?: ReadonlyArray<CompoundVariant<V>>;
}

export type VariantArgs<V extends VariantMap> = VariantProps<V> & { class?: string };

export function defineVariants<V extends VariantMap>(config: VariantConfig<V>) {
  return (props: VariantArgs<V> = {}): string => {
    const parts: string[] = [];
    if (config.base) parts.push(config.base);

    for (const key in config.variants) {
      const value = (props[key] ?? config.defaultVariants?.[key]) as string | undefined;
      if (value && config.variants[key][value]) parts.push(config.variants[key][value]);
    }

    for (const cv of config.compoundVariants ?? []) {
      const { class: cls, ...match } = cv;
      const matches = Object.entries(match).every(
        ([k, v]) => (props[k as keyof V] ?? config.defaultVariants?.[k as keyof V]) === v,
      );
      if (matches) parts.push(cls);
    }

    if (props.class) parts.push(props.class);
    return parts.join(" ");
  };
}
