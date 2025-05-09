"use client";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Introducao = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Bem-vindo à Plataforma de Atribuição de Turmas
      </Typography>

      <Typography variant="body1" paragraph>
        Esta ferramenta foi desenvolvida para auxiliar os docentes no
        preenchimento dos formulários referentes às turmas de interesse para o
        próximo semestre. O objetivo da plataforma é ser simples e objetiva, com
        passos definidos e de fácil execução.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Como funciona o processo?
      </Typography>

      <List>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary="1️⃣ Seleção de Turmas"
            secondary={
              <>
                O processo inicia com a seleção das turmas de interesse. Essa
                seleção é apresentada como itens de uma loja, onde você poderá
                escolher as turmas e adicioná-las a um “carrinho”. Caso deseje,
                já é possível definir a prioridade para cada turma no momento da
                adição. Mas fique tranquilo: o próximo passo permitirá revisar e
                modificar essas prioridades.
                <br />
                <strong>Importante:</strong> Para prosseguir, ao menos uma turma
                deve ser selecionada. Todas as telas apresentam botões de{" "}
                <em>Voltar</em> e <em>Continuar</em> para revisão do processo.
              </>
            }
          />
        </ListItem>

        <Divider component="li" sx={{ my: 2 }} />

        <ListItem alignItems="flex-start">
          <ListItemText
            primary="2️⃣ Confirmação de Seleção"
            secondary={
              <>
                Neste passo, você poderá confirmar as turmas selecionadas,
                visualizando-as em uma tabela com informações principais, como
                nome e horários. Uma coluna específica exibirá as prioridades,
                que podem ser editadas ou preenchidas (caso não tenham sido
                informadas anteriormente).
                <br />
                <strong>Importante:</strong> Todas as prioridades devem ser
                preenchidas para liberar o botão de <em>Confirmação</em>. Só
                após essa confirmação será possível prosseguir para a próxima
                etapa.
              </>
            }
          />
        </ListItem>

        <Divider component="li" sx={{ my: 2 }} />

        <ListItem alignItems="flex-start">
          <ListItemText
            primary="3️⃣ Download do Arquivo"
            secondary={
              <>
                No último passo, você poderá baixar o arquivo finalizado, que
                deverá ser enviado à comissão responsável pelo processo de
                atribuição. Detalhes adicionais e instruções estarão disponíveis
                nesta etapa para garantir que tudo ocorra corretamente.
              </>
            }
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default Introducao;
