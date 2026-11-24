import com.mojang.brigadier.*;
import com.mojang.brigadier.exceptions.CommandSyntaxException;
import net.minecraft.SharedConstants;
import net.minecraft.commands.*;
import net.minecraft.core.*;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.data.registries.VanillaRegistries;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.RegistryDataLoader;
import net.minecraft.server.Bootstrap;
import net.minecraft.server.packs.PackLocationInfo;
import net.minecraft.server.packs.PackResources;
import net.minecraft.server.packs.PackType;
import net.minecraft.server.packs.PathPackResources;
import net.minecraft.server.packs.repository.PackSource;
import net.minecraft.server.packs.repository.ServerPacksSource;
import net.minecraft.server.packs.resources.MultiPackResourceManager;
import net.minecraft.server.permissions.LevelBasedPermissionSet;
import net.minecraft.tags.TagLoader;
import net.minecraft.world.phys.*;

import java.nio.file.*;
import java.util.*;
import java.util.stream.*;

/**
 * Parses every command line of every .mcfunction under a folder with the game's own command dispatcher, so a renamed
 * argument or a wrong NBT path shows up without launching the game. Parse only: nothing is executed, and a path that
 * is syntactically valid but names a missing key is not caught. Usage: CmdCheck FUNCTION_DIR [PACK_DIR]
 * With PACK_DIR (the folder that holds data/ and pack.mcmeta) the pack's own loot tables, predicates, item modifiers and
 * tags are loaded on top of the vanilla data, so ids of that pack resolve instead of failing.
 * Lines starting with $ (macros) are skipped. Needs the 26.3 client jar and Java 25.
 */
public class CmdCheck {
    public static void main(String[] args) throws Exception {
        SharedConstants.tryDetectVersion();
        Bootstrap.bootStrap();
        HolderLookup.Provider lookup = args.length > 1 ? packLookup(Path.of(args[1]).toAbsolutePath())
            : VanillaRegistries.createReloadableLookup(VanillaRegistries.createWorldLookup());
        Commands commands = new Commands(Commands.CommandSelection.ALL, Commands.createValidationContext(lookup));
        CommandDispatcher<CommandSourceStack> d = commands.getDispatcher();
        CommandSourceStack src = new CommandSourceStack(CommandSource.NULL, Vec3.ZERO, Vec2.ZERO, null,
            LevelBasedPermissionSet.OWNER, Component.literal("check"), null);
        Path root = Paths.get(args[0]);
        int lines = 0, bad = 0;
        List<Path> files;
        try (Stream<Path> s = Files.walk(root)) { files = s.filter(p -> p.toString().endsWith(".mcfunction")).sorted().collect(Collectors.toList()); }
        for (Path f : files) {
            int n = 0;
            for (String raw : Files.readAllLines(f)) {
                n++;
                String line = raw.strip();
                if (line.isEmpty() || line.startsWith("#") || line.startsWith("$")) continue;
                lines++;
                String err = null;
                try {
                    ParseResults<CommandSourceStack> r = d.parse(line, src);
                    if (r.getReader().canRead()) {
                        err = r.getExceptions().isEmpty() ? "unparsed tail: " + r.getReader().getRemaining()
                            : r.getExceptions().values().iterator().next().getMessage();
                    } else if (r.getContext().getNodes().isEmpty()) err = "no node";
                    else if (!hasCommand(r)) err = "incomplete command";
                } catch (Exception ex) { err = ex.toString(); }
                if (err != null) { bad++; Bootstrap.STDOUT.println(root.relativize(f).toString().replace(java.io.File.separatorChar, '/') + ":" + n + ": " + err + "\n    " + line); }
            }
        }
        Bootstrap.STDOUT.println("files: " + files.size() + ", commands: " + lines + ", problems: " + bad);
        System.exit(bad == 0 ? 0 : 1);
    }

    /** Vanilla data plus the pack at repo, as one lookup for the command validation context. */
    static HolderLookup.Provider packLookup(Path repo) throws Exception {
        PackLocationInfo info = new PackLocationInfo("repo", Component.literal("repo"), PackSource.WORLD, Optional.empty());
        List<PackResources> packs = List.<PackResources>of(ServerPacksSource.createVanillaPackSource().fullResources(), new PathPackResources(info, repo));
        try (MultiPackResourceManager manager = new MultiPackResourceManager(PackType.SERVER_DATA, packs)) {
            RegistryAccess.Frozen builtIn = RegistryAccess.fromRegistryOfRegistries(BuiltInRegistries.REGISTRY);
            var pending = TagLoader.loadTagsForExistingRegistries(manager, builtIn);
            List<HolderLookup.RegistryLookup<?>> lookups = new ArrayList<>(TagLoader.buildUpdatedLookups(builtIn, pending));
            RegistryAccess.Frozen world = RegistryDataLoader.load(manager, lookups, RegistryDataLoader.WORLD_REGISTRIES, Runnable::run).join();
            world.registries().forEach(e -> lookups.add(e.value()));
            RegistryAccess.Frozen reloadable = RegistryDataLoader.load(manager, lookups, RegistryDataLoader.RELOADABLE_REGISTRIES, Runnable::run).join();
            reloadable.registries().forEach(e -> lookups.add(e.value()));
            return HolderLookup.Provider.create(lookups.stream());
        }
    }

    static boolean hasCommand(ParseResults<CommandSourceStack> r) {
        var c = r.getContext();
        while (c.getChild() != null) c = c.getChild();
        return c.getCommand() != null;
    }
}
