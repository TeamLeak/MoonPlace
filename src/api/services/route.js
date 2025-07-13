async function handler({ method, id, name, description, price }) {
  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (method === "GET") {
    if (id) {
      const service = await sql`
        SELECT * FROM services WHERE id = ${id}
      `;
      return { service: service[0] };
    }

    const services = await sql`
      SELECT * FROM services ORDER BY created_at DESC
    `;
    return { services };
  }

  const isAdmin = await sql`
    SELECT * FROM auth_users WHERE id = ${session.user.id} AND role = 'admin'
  `;

  if (!isAdmin.length) {
    return { error: "Unauthorized - Admin access required" };
  }

  if (method === "POST") {
    if (!name || !description || !price) {
      return { error: "Name, description and price are required" };
    }

    const service = await sql`
      INSERT INTO services (name, description, price)
      VALUES (${name}, ${description}, ${price})
      RETURNING *
    `;
    return { service: service[0] };
  }

  if (method === "PUT") {
    if (!id) {
      return { error: "Service ID is required" };
    }

    const setValues = [];
    const queryParams = [];
    let paramCount = 1;

    if (name) {
      setValues.push(`name = $${paramCount}`);
      queryParams.push(name);
      paramCount++;
    }
    if (description) {
      setValues.push(`description = $${paramCount}`);
      queryParams.push(description);
      paramCount++;
    }
    if (price) {
      setValues.push(`price = $${paramCount}`);
      queryParams.push(price);
      paramCount++;
    }

    if (setValues.length === 0) {
      return { error: "No updates provided" };
    }

    queryParams.push(id);
    const service = await sql(
      `UPDATE services SET ${setValues.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      queryParams
    );
    return { service: service[0] };
  }

  if (method === "DELETE") {
    if (!id) {
      return { error: "Service ID is required" };
    }

    await sql`
      DELETE FROM services WHERE id = ${id}
    `;
    return { success: true };
  }

  return { error: "Method not allowed" };
}

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { signUpWithCredentials } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Проверка силы пароля
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password || !confirmPassword || !name) {
      setError("Пожалуйста, заполните все поля");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setLoading(false);
      return;
    }

    try {
      await signUpWithCredentials({
        email,
        password,
        name,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin: "Не удалось начать регистрацию. Попробуйте еще раз.",
        OAuthCallback:
          "Ошибка регистрации после перенаправления. Попробуйте еще раз.",
        OAuthCreateAccount:
          "Не удалось создать аккаунт. Попробуйте другой способ.",
        EmailCreateAccount: "Этот email уже используется.",
        Callback: "Что-то пошло не так. Попробуйте еще раз.",
        OAuthAccountNotLinked: "Этот аккаунт связан с другим способом входа.",
        CredentialsSignin:
          "Неверные данные. Если у вас уже есть аккаунт, попробуйте войти.",
        AccessDenied: "У вас нет разрешения на регистрацию.",
        Configuration: "Регистрация временно недоступна. Попробуйте позже.",
        Verification: "Ссылка для регистрации истекла. Запросите новую.",
      };

      setError(
        errorMessages[err.message] || "Что-то пошло не так. Попробуйте еще раз."
      );
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Слабый";
      case 2:
        return "Средний";
      case 3:
        return "Хороший";
      case 4:
        return "Отличный";
      default:
        return "";
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
            <h1 className="text-2xl font-bold mt-4 mb-2">Создать аккаунт</h1>
            <p className="text-gray-400">Присоединяйтесь к нашему серверу</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ваше имя
                </label>
                <div className="relative">
                  <input
                    required
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Введите ваше имя"
                    className="w-full bg-[#1a0b2e] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a855f7]">
                    <i className="fas fa-user"></i>
                  </div>
                </div>
              </div>

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
                    placeholder="Создайте пароль"
                    className="w-full bg-[#1a0b2e] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a855f7]">
                    <i className="fas fa-lock"></i>
                  </div>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Используйте заглавные буквы, цифры и символы для
                      надежности
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Подтвердите пароль
                </label>
                <div className="relative">
                  <input
                    required
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите пароль"
                    className="w-full bg-[#1a0b2e] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a855f7]">
                    <i
                      className={`fas ${
                        password &&
                        confirmPassword &&
                        password === confirmPassword
                          ? "fa-check text-green-400"
                          : "fa-lock"
                      }`}
                    ></i>
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
                  Создание аккаунта...
                </div>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  Создать аккаунт
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Уже есть аккаунт?{" "}
                <a
                  href="/account/signin"
                  className="text-[#a855f7] hover:text-[#ff69b4] transition-colors font-medium"
                >
                  Войти
                </a>
              </p>
            </div>
          </form>

          {/* Преимущества регистрации */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-center space-y-3">
              <p className="text-gray-400 text-xs">Преимущества аккаунта:</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-green-400">
                  <i className="fas fa-save"></i>
                  <span>Сохранение прогресса</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <i className="fas fa-coins"></i>
                  <span>Покупка монет</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <i className="fas fa-users"></i>
                  <span>Создание кланов</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <i className="fas fa-trophy"></i>
                  <span>Рейтинги</span>
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