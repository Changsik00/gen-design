import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

/**
 * LoginPage — Paper E2E 데모와 1:1 대응되는 shadcn/ui 구현
 *
 * Paper 노드 트리                    → 이 코드
 * ──────────────────────────────────────────────
 * Frame (카드 컨테이너)              → <Card>
 *   Frame (헤더)                    →   <CardHeader>
 *     Text "로그인"                 →     <CardTitle>
 *     Text "계정에 로그인하세요"      →     <CardDescription>
 *   Frame (폼)                      →   <CardContent>
 *     Frame (이메일) > Label + Input →     <Label> + <Input>
 *     Frame (비밀번호) > Label + Input →   <Label> + <Input>
 *   Frame "Button" (로그인)          →   <Button>
 *   Frame (소셜 × 3)               →   <Button variant="outline"> × 3
 *   Frame (회원가입 링크)            →   <p> text
 */
function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>계정에 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>이메일</Label>
            <Input placeholder="이메일을 입력하세요" />
          </div>
          <div className="space-y-2">
            <Label>비밀번호</Label>
            <Input type="password" placeholder="비밀번호를 입력하세요" />
          </div>
          <Button className="w-full">로그인</Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">Google</Button>
            <Button variant="outline" className="flex-1">Apple</Button>
            <Button variant="outline" className="flex-1">Kakao</Button>
          </div>
          <p className="text-center text-sm">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <a href="#" className="underline font-medium">회원가입</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
