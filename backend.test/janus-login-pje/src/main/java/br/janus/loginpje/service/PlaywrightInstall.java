public class PlaywrightInstall {
    public static void main(String[] args) {
        try {
            com.microsoft.playwright.CLI.main(new String[]{"install"});
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Falha ao instalar browsers do Playwright!");
        }
    }
}
