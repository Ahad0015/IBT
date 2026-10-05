# Rendering Strategy

| Route        | Strategy          | Why                                                        |
|--------------|-------------------|------------------------------------------------------------|
| `/`          | Static            | The story and address never change between builds          |
| `/menu`      | ISR, 1 hour       | Dishes change occasionally; speed matters most             |
| `/menu/[id]` | Static via params | Every dish is known at build time (`generateStaticParams`) |
| `/cart`      | Client            | The person's own state, and private                        |
| `/checkout`  | Dynamic           | Reads the session cookie (`cookies()`) and live pricing    |