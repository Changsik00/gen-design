# Button

shadcn Button primitive — Tier 2 어휘.

## 대표 variant

<Button variant="default" size="default" />

## 다른 variants

<Button variant="outline" size="sm" />
<Button variant="destructive" size="lg" />
<Button variant="ghost" size="icon" />

## i18n placeholder 자식

<Button variant="default">{{i18n.ko.action.confirm}}</Button>

## L4 인라인 토큰 override

<Button variant="default" tokens={{ "--primary": "{{token.semantic.brand-2}}" }}>
  {{i18n.ko.action.submit}}
</Button>
