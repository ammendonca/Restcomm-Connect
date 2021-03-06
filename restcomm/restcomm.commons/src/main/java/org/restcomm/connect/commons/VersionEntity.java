/*
 * TeleStax, Open Source Cloud Communications
 * Copyright 2011-2013, Telestax Inc and individual contributors
 * by the @authors tag.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

package org.restcomm.connect.commons;

/**
 * Created by gvagenas on 1/19/16.
 * @author gvagenas
 */
public class VersionEntity {

    private final String version;
    //Git hash
    private final String revision;
    private final String name;
    private final String date;
    private final String disclaimer;

    public VersionEntity(final String version, final String revision, final String name, final String date, final String disclaimer) {
        this.version = version;
        this.revision = revision;
        this.name = name;
        this.date = date;
        this.disclaimer = disclaimer;
    }

    public String getVersion() {
        return version;
    }

    public String getRevision() {
        return revision;
    }

    public String getName() {
        return name;
    }

    public String getDate() {
        return date;
    }

    public String getDisclaimer() {
        return disclaimer;
    }
}
