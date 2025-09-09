describe('Testes de Login', () => {
  it('Login com sucesso', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="email"]').type('cocoloti@gmail.com')
    cy.get('[data-testid="senha"]').type('12345')
    cy.get('[data-testid="entrar"]').click()
    cy.get('[data-testid="pesquisar"]').should('exist')
  })

  it('Login com falha', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="email"]').type('cocoloti@gmail.com')
    cy.get('[data-testid="senha"]').type('123')
    cy.get('[data-testid="entrar"]').click()
    cy.get('.alert > :nth-child(2)').contains('Email e/ou senha inválidos')
  })

  it('Login com campos vazios', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="entrar"]').click()
    cy.get('.alert > :nth-child(2)').contains('Email é obrigatório')
  })
})

describe('Cadastro de Usuários', () => {
  it('Cadastro com e-mail sequencial', () => {
    cy.task('getNextId').then((id) => {
      const email = `guilherme${id}@gmail.com`

      cy.visit('https://front.serverest.dev/cadastrarusuarios')
      cy.get('[data-testid="nome"]').type('Guilherme Teste')
      cy.get('[data-testid="email"]').type(email)
      cy.get('[data-testid="password"]').type('12345')
      cy.get('[data-testid="checkbox"]').check()
      cy.get('[data-testid="cadastrar"]').click()
      cy.get('.alert > :nth-child(2)').contains('Cadastro realizado com sucesso')
    })
  })

  it('Erro ao cadastrar usuário sem preencher campos', () => {
    cy.visit('https://front.serverest.dev/cadastrarusuarios')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('.alert > :nth-child(2)').should('exist')
  })
})

describe('Fluxo de Compras', () => {
  beforeEach(() => {
    // Login antes de cada teste de compras
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="email"]').type('cocoloti@gmail.com')
    cy.get('[data-testid="senha"]').type('12345')
    cy.get('[data-testid="entrar"]').click()
  })

  it('Pesquisar produto inexistente', () => {
    cy.get('[data-testid="pesquisar"]').type('ProdutoInvalido123')
    cy.get('[data-testid="botaoPesquisar"]').click()
    cy.get('p').contains('Nenhum produto foi encontrado')
  })

  it('Adicionar produto na lista de compras e enviar ao carrinho', () => {
  cy.get('[data-testid="pesquisar"]').type('Logitech')
  cy.get('[data-testid="botaoPesquisar"]').click()
  cy.get('h4').contains('Produtos')

  cy.contains('.card-title', 'Logitech MX Vertical')
    .parents('.card-body')
    .as('produtoCard')

  cy.get('@produtoCard').find('.card-title')
    .invoke('text')
    .then((nomeProduto) => {
      // Adicionar na lista de compras
      cy.get('@produtoCard').find('[data-testid="adicionarNaLista"]').click()
      cy.get('h1').contains('Lista de Compras')
      cy.get('[data-testid="shopping-cart-product-name"]')
        .should('contain.text', nomeProduto.trim())

      // Adicionar ao carrinho
      cy.get('[data-testid="adicionar carrinho"]').click()
     cy.get('h1').contains('Em construção aguarde')
    })
})


  it('Remover produto da lista de compras', () => {
    // Pesquisa produto específico
    cy.get('[data-testid="pesquisar"]').type('Logitech')
    cy.get('[data-testid="botaoPesquisar"]').click()
    cy.get('h4').contains('Produtos')

    // Seleciona o card do produto específico
    cy.contains('.card-title', 'Logitech MX Vertical')
      .parents('.card-body')
      .as('produtoCard')

    cy.get('@produtoCard').find('.card-title')
      .invoke('text')
      .then((nomeProduto) => {

        // Adiciona o produto na lista de compras
        cy.get('@produtoCard').find('[data-testid="adicionarNaLista"]').click()

        // Vai para a lista de compras
        cy.get('h1').contains('Lista de Compras')

        // Valida que o produto está na lista
        cy.get('[data-testid="shopping-cart-product-name"]')
          .should('contain.text', nomeProduto.trim())

        // Remove o produto
       cy.get('[data-testid="limparLista"]').click()
       cy.get('[data-testid="shopping-cart-empty-message"]').contains('Seu carrinho está vazio')
      })
  })
})