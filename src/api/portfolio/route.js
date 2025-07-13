async function handler({ method, id, title, description, imageUrl }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (method === "GET") {
    const portfolioItems = await sql`
      SELECT * FROM portfolio_items 
      ORDER BY created_at DESC
    `;
    return { portfolioItems };
  }

  const isAdmin = await sql`
    SELECT role FROM auth_users 
    WHERE id = ${session.user.id} 
    AND role = 'admin'
  `;

  if (!isAdmin.length) {
    return { error: "Unauthorized: Admin access required" };
  }

  if (method === "POST") {
    if (!title || !description || !imageUrl) {
      return { error: "Title, description and image URL are required" };
    }

    const newItem = await sql`
      INSERT INTO portfolio_items (
        title,
        description,
        image_url
      ) 
      VALUES (
        ${title},
        ${description},
        ${imageUrl}
      )
      RETURNING *
    `;
    return { portfolioItem: newItem[0] };
  }

  if (method === "PUT") {
    if (!id) {
      return { error: "Portfolio item ID is required" };
    }

    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (title) {
      updateFields.push(`title = $${paramCount}`);
      updateValues.push(title);
      paramCount++;
    }
    if (description) {
      updateFields.push(`description = $${paramCount}`);
      updateValues.push(description);
      paramCount++;
    }
    if (imageUrl) {
      updateFields.push(`image_url = $${paramCount}`);
      updateValues.push(imageUrl);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return { error: "No fields to update" };
    }

    updateValues.push(id);
    const updatedItem = await sql(
      `UPDATE portfolio_items 
       SET ${updateFields.join(", ")} 
       WHERE id = $${paramCount} 
       RETURNING *`,
      updateValues
    );

    if (!updatedItem.length) {
      return { error: "Portfolio item not found" };
    }

    return { portfolioItem: updatedItem[0] };
  }

  if (method === "DELETE") {
    if (!id) {
      return { error: "Portfolio item ID is required" };
    }

    const deletedItem = await sql`
      DELETE FROM portfolio_items 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (!deletedItem.length) {
      return { error: "Portfolio item not found" };
    }

    return { portfolioItem: deletedItem[0] };
  }

  return { error: "Method not allowed" };
}

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { signInWithCredentials } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin: "Не удалось начать вход. Попробуйте еще раз.",
        OAuthCallback:
          "Ошибка входа после перенаправления. Попробуйте еще раз.",
        OAuthCreateAccount:
          "Не удалось создать аккаунт. Попробуйте другой способ.",
        EmailCreateAccount: "Этот email уже используется или недоступен.",
        Callback: "Что-то пошло не так. Попробуйте еще раз.",
        OAuthAccountNotLinked: "Этот аккаунт связан с другим способом входа.",
        CredentialsSignin: "Неверный email или пароль.",
        AccessDenied: "У вас нет разрешения на вход.",
        Configuration: "Вход временно недоступен. Попробуйте позже.",
        Verification: "Ссылка для входа истекла. Запросите новую.",
      };

      setError(
        errorMessages[err.message] || "Что-то пошло не так. Попробуйте еще раз."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f051d] to-[#1a0b2e] text-white flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.15), transparent 80%)`,
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#2d1b4b]/50 backdrop-blur-xl rounded-2xl p-8 border border-[#a855f7]/20 shadow-2xl shadow-[#a855f7]/10">
          {/* Логотип */}
          <div className="text-center mb-8">
            <a
              href="/"
              className="text-3xl font-bold bg-gradient-to-r from-[#a855f7] to-[#ff69b4] text-transparent bg-clip-text"
            >
              Moon Place
            </a>
            <h1 className="text-2xl font-bold mt-4 mb-2">Добро пожаловать!</h1>
            <p className="text-gray-400">Войдите в свой аккаунт</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email адрес
                </label>
                <div className="relative">
                  <input
                    required
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Введите ваш email"
                    className="w-full bg-[#1a0b2e] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a855f7]">
                    <i className="fas fa-envelope"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <input
                    required
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите ваш пароль"
                    className="w-full bg-[#1a0b2e] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a855f7]">
                    <i className="fas fa-lock"></i>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#a855f7] to-[#ff69b4] hover:from-[#9333ea] hover:to-[#e11d48] px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg shadow-[#a855f7]/25"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Вход...
                </div>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Войти в аккаунт
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Нет аккаунта?{" "}
                <a
                  href="/account/signup"
                  className="text-[#a855f7] hover:text-[#ff69b4] transition-colors font-medium"
                >
                  Зарегистрироваться
                </a>
              </p>
            </div>
          </form>

          {/* Дополнительная информация */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-center space-y-3">
              <p className="text-gray-400 text-xs">
                Войдя в аккаунт, вы получите:
              </p>
              <div className="flex justify-center gap-6 text-xs">
                <div className="flex items-center gap-1 text-green-400">
                  <i className="fas fa-check"></i>
                  <span>Сохранение прогресса</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  <i className="fas fa-coins"></i>
                  <span>Покупка монет</span>
                </div>
                <div className="flex items-center gap-1 text-purple-400">
                  <i className="fas fa-users"></i>
                  <span>Доступ к кланам</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ссылка на главную */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center justify-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
}
export async function POST(request) {
  return handler(await request.json());
}